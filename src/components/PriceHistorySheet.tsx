import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Price } from '@/types/price';

interface PriceHistorySheetProps {
    isOpen: boolean;
    onClose: () => void;
    priceHistory: Price[];
    productName: string;
}

const PriceHistorySheet: React.FC<PriceHistorySheetProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 priceHistory,
                                                                 productName
                                                             }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
    };

    const data = priceHistory.map(item => ({
        ...item,
        formattedDate: formatDate(item.effectiveDate)
    }));

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:w-[600px] md:w-[800px]">
                <SheetHeader>
                    <SheetTitle>Lịch sử giá - {productName}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="formattedDate"
                                label={{ value: 'Ngày áp dụng', position: 'bottom' }}
                            />
                            <YAxis
                                tickFormatter={(value) => formatPrice(value)}
                                label={{ value: 'Giá', angle: -90, position: 'left' }}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatPrice(value), 'Giá']}
                                labelFormatter={(label) => `Ngày: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ fill: '#2563eb' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default PriceHistorySheet;
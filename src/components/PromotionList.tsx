// components/PromotionList.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Check } from "lucide-react";
import {Promotion, PromotionListProps} from "@/types/promotion";

import { format } from 'date-fns';


export default function PromotionList({
                                          promotions,
                                          onPromotionAdded,
                                          onPromotionDeleted,
                                          onPromotionUpdated
                                      }: PromotionListProps) {

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    };

    const getStatusColor = (promotion: Promotion) => {
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        if (!promotion.isActive) return 'bg-red-100 text-red-800';
        if (now < startDate) return 'bg-yellow-100 text-yellow-800';
        if (now > endDate) return 'bg-gray-100 text-gray-800';
        return 'bg-green-100 text-green-800';
    };
    const getStatusText = (promotion: Promotion) => {
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        if (!promotion.isActive) return 'Không hoạt động';
        if (now < startDate) return 'Sắp diễn ra';
        if (now > endDate) return 'Đã kết thúc';
        return 'Đang diễn ra';
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button
                    onClick={onPromotionAdded}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Thêm khuyến mãi
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">STT</TableHead>
                            <TableHead>Tên khuyến mãi</TableHead>
                            <TableHead className="w-[100px] text-center">Giảm giá</TableHead>
                            <TableHead className="w-[150px] text-center">Ngày bắt đầu</TableHead>
                            <TableHead className="w-[150px] text-center">Ngày kết thúc</TableHead>
                            <TableHead className="w-[100px] text-center">Sản phẩm</TableHead>
                            <TableHead className="w-[120px] text-center">Trạng thái</TableHead>
                            <TableHead className="w-[130px] text-center">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promotions.map((promotion, index) => (
                            <TableRow key={promotion.id}>
                                <TableCell className="text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{promotion.name}</div>
                                        <div className="text-sm text-gray-500">{promotion.description}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {promotion.discount}%
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatDate(promotion.startDate)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatDate(promotion.endDate)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {promotion.remainingDays}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(promotion)}`}
                                    >
                                        {getStatusText(promotion)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onPromotionUpdated(promotion)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        {promotion.isActive ? (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onPromotionDeleted(promotion)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="border-green-500 text-green-500 hover:bg-green-50"
                                                onClick={() => onPromotionDeleted(promotion)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {promotions.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
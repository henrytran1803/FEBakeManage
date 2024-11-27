import React, { useState } from 'react';
import { Pencil, XCircle, CheckCircle, History } from 'lucide-react';
import { ProductTableProps } from '@/types/product';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/imageUtils.ts";
import PriceHistorySheet from './PriceHistorySheet';
import { productService } from '@/services/productService';
import { Price } from '@/types/price';

export const ProductTable: React.FC<ProductTableProps> = ({
                                                              products,
                                                              onEdit,
                                                              onStatusChange,
                                                          }) => {
    const [selectedProduct, setSelectedProduct] = useState<{id: number; name: string} | null>(null);
    const [priceHistory, setPriceHistory] = useState<Price[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleViewPriceHistory = async (productId: number, productName: string) => {
        try {
            const response = await productService.getPricehistory(productId);
            if (response.success) {
                setPriceHistory(response.data);
                setSelectedProduct({ id: productId, name: productName });
                setIsHistoryOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch price history:', error);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead className="text-right">Giá</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="text-center font-medium">
                                {product.id}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {product.images && product.images[0] && (
                                        <img
                                            src={getImageUrl(product.images[0])}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                    <div className="ml-4">
                                        <div className="font-medium">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.categoryName}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {formatPrice(product.currentPrice)}
                            </TableCell>
                            <TableCell className="text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs
                                    ${product.status
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {product.status ? 'Đang bán' : 'Ngừng bán'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onEdit(product)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleViewPriceHistory(product.id, product.name)}
                                    >
                                        <History className="h-4 w-4" />
                                    </Button>

                                    {product.status ? (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => onStatusChange(product.id, product.status)}
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="border-green-500 text-green-500 hover:bg-green-50"
                                            onClick={() => onStatusChange(product.id, product.status)}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedProduct && (
                <PriceHistorySheet
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    priceHistory={priceHistory}
                    productName={selectedProduct.name}
                />
            )}
        </>
    );
};
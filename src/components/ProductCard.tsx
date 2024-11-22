import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchProductActiveResponse } from "@/types/product.ts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {getImageUrl} from "@/utils/imageUtils.ts";

export const ProductCard = ({ product }: { product: SearchProductActiveResponse }) => {
    const navigate = useNavigate();
    const discount = product.maxDailyDiscount || 0;
    const finalPrice = product.price * (1 - discount / 100);

    const handleNavigate = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div
            onClick={handleNavigate}
            className="h-full hover:shadow-lg transition-shadow cursor-pointer group relative"
        >
            <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                {discount > 0 && (
                    <Badge className="bg-red-500 text-white">
                        -{discount}%
                    </Badge>
                )}
                <Badge variant="secondary">
                    Còn {product.totalQuantity} sản phẩm
                </Badge>
            </div>
            <Card>
                <CardHeader className="p-0">
                    <img
                        src={getImageUrl( product.imageUrl) || "/placeholder.png"}
                        alt={product.name}
                        className="h-48 w-full object-cover rounded-t-lg"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{product.categoryName}</p>
                    <div className="mt-2 flex flex-col">
                        <span className="text-lg font-bold text-primary">
                            {finalPrice.toLocaleString()}đ
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                {product.price.toLocaleString()}đ
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
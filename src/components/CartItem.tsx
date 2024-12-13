import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {ProductCart} from "@/types/product.ts";
import {getImageUrl} from "@/utils/imageUtils.ts";

interface CartItemProps {
    item: {
        productBatchId: number;
        quantity: number;
    };
    productDetails: ProductCart;
    onUpdateQuantity: (item: { productBatchId: number; quantity: number }) => void;
    onRemove: (productBatchId: number) => void;
    onCheckout: () => void; // Callback để xử lý checkout
}

const CartItem: React.FC<CartItemProps> = ({
                                               item,
                                               productDetails,
                                               onUpdateQuantity,
                                               onRemove,
                                               onCheckout
                                           }) => {
    const getDiscountedPrice = () => {
        const basePrice = productDetails.price * item.quantity;
        const dailyDiscountAmount = basePrice * (productDetails.dailyDiscount / 100);
        const bonusDiscountAmount = basePrice * (productDetails.discountBonus / 100);
        return basePrice - dailyDiscountAmount - bonusDiscountAmount;
    };
    const discountedPrice = getDiscountedPrice(); // Tính giá cuối sau khi giảm giá
    console.log(getDiscountedPrice())
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <img
                src={getImageUrl(productDetails.imageUrl) || "/api/placeholder/100/100"}
                alt={productDetails.name}
                className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
                <h3 className="font-medium">{productDetails.name}</h3>
                <p className="text-sm text-gray-600">Loại: {productDetails.categoryName}</p>
                <p className="text-sm text-gray-600">Mã lô: {productDetails.productBatchId}</p>
                <div className="flex items-center gap-2 mt-2">
          <span className="font-medium">
            ${productDetails.price.toFixed(2)}
          </span>
                    {productDetails.dailyDiscount > 0 && (
                        <span className="text-red-500">
              (-{productDetails.dailyDiscount}%)
            </span>
                    )}
                    {productDetails.discountBonus > 0 && (
                        <span className="text-orange-500">
              (-{productDetails.discountBonus}%)
            </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={item.quantity}
                    min={1}
                    max={productDetails.quantityRemain}
                    className="w-20"
                    onChange={(e) => onUpdateQuantity({
                        ...item,
                        quantity: parseInt(e.target.value)
                    })}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.productBatchId)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default CartItem;
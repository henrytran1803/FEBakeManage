// CartSummary.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCart } from '@/types/product';

interface CartSummaryProps {
    cartItems: {
        productBatchId: number;
        quantity: number;
    }[];
    productDetails: ProductCart[];
    discountCode: string;
    onDiscountChange: (code: string) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
                                                     cartItems,
                                                     productDetails,
                                                     discountCode,
                                                     onDiscountChange
                                                 }) => {
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const details = productDetails.find(p => p.productBatchId === item.productBatchId);
            if (!details) return total;

            const basePrice = details.price * item.quantity;
            const dailyDiscountAmount = basePrice * (details.dailyDiscount / 100);
            const bonusDiscountAmount = basePrice * (details.discountBonus / 100);
            return total + (basePrice - dailyDiscountAmount - bonusDiscountAmount);
        }, 0);
    };

    return (
        <Card className="p-4">
            <CardContent>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Discount Code</label>
                        <Input
                            value={discountCode}
                            onChange={(e) => onDiscountChange(e.target.value)}
                            placeholder="Enter discount code"
                        />
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    <Button className="w-full">
                        Proceed to Checkout
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CartSummary;
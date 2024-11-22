// Cart.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ProductCart } from '@/types/product';
import { productService } from "@/services/productService.ts";
import CartItem from "@/components/CartItem.tsx";
import CartSummary from "@/components/CartSummary.tsx";
import { useCartStore } from "@/store/useCartStore.ts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { currentCart, updateItem, removeItem } = useCartStore();
    const [productDetails, setProductDetails] = useState<ProductCart[]>([]);
    const [discountCode, setDiscountCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProductDetails = async () => {
            try {
                const response = await productService.getProductCart({
                    discountCode,
                    productBatchCarts: currentCart.carts
                });
                setProductDetails(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load product details:', error);
                setIsLoading(false);
            }
        };

        loadProductDetails();
    }, [currentCart.carts, discountCode]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    return (
        <div className="fixed inset-0 bg-gray-50 p-10">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="hover:bg-gray-200"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        {currentCart.carts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Your cart is empty
                            </div>
                        ) : (
                            currentCart.carts.map((item) => {
                                const details = productDetails.find(
                                    p => p.productBatchId === item.productBatchId
                                );
                                return details ? (
                                    <CartItem
                                        key={item.productBatchId}
                                        item={item}
                                        productDetails={details}
                                        onUpdateQuantity={updateItem}
                                        onRemove={removeItem}
                                    />
                                ) : null;
                            })
                        )}
                    </Card>
                </div>
                <div>
                    <CartSummary
                        cartItems={currentCart.carts}
                        productDetails={productDetails}
                        discountCode={discountCode}
                        onDiscountChange={setDiscountCode}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cart;
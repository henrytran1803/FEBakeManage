import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem } from "@/types/productBatch.ts";

interface CartStore {
    currentCart: Cart;  // Bỏ null type
    addItem: (item: CartItem) => void;
    updateItem: (item: CartItem) => void;
    removeItem: (productBatchId: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            currentCart: {
                table: 1,
                carts: []
            },

            addItem: (newItem) =>
                set((state) => {
                    const existingItemIndex = state.currentCart.carts.findIndex(
                        item => item.productBatchId === newItem.productBatchId
                    );

                    const updatedCarts = [...state.currentCart.carts];

                    if (existingItemIndex >= 0) {
                        updatedCarts[existingItemIndex] = {
                            ...updatedCarts[existingItemIndex],
                            quantity: updatedCarts[existingItemIndex].quantity + newItem.quantity
                        };
                    } else {
                        updatedCarts.push(newItem);
                    }

                    return {
                        currentCart: {
                            ...state.currentCart,
                            carts: updatedCarts
                        }
                    };
                }),

            updateItem: (updatedItem) =>
                set((state) => ({
                    currentCart: {
                        ...state.currentCart,
                        carts: state.currentCart.carts.map(item =>
                            item.productBatchId === updatedItem.productBatchId
                                ? updatedItem
                                : item
                        )
                    }
                })),

            removeItem: (productBatchId) =>
                set((state) => ({
                    currentCart: {
                        ...state.currentCart,
                        carts: state.currentCart.carts.filter(
                            item => item.productBatchId !== productBatchId
                        )
                    }
                })),

            clearCart: () => set({
                currentCart: {
                    table: 1,
                    carts: []
                }
            }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => sessionStorage), // Sử dụng sessionStorage
            partialize: (state) => ({ currentCart: state.currentCart }), // Chỉ lưu currentCart
        }
    )
);
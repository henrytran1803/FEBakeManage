// // CartSummary.tsx
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { ProductCart } from '@/types/product';

// interface CartSummaryProps {
//     cartItems: {
//         productBatchId: number;
//         quantity: number;
//     }[];
//     productDetails: ProductCart[];
//     discountCode: string;
//     onDiscountChange: (code: string) => void;
// }

// const CartSummary: React.FC<CartSummaryProps> = ({
//                                                      cartItems,
//                                                      productDetails,
//                                                      discountCode,
//                                                      onDiscountChange
//                                                  }) => {
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => {
//             const details = productDetails.find(p => p.productBatchId === item.productBatchId);
//             if (!details) return total;

//             const basePrice = details.price * item.quantity;
//             const dailyDiscountAmount = basePrice * (details.dailyDiscount / 100);
//             const bonusDiscountAmount = basePrice * (details.discountBonus / 100);
//             return total + (basePrice - dailyDiscountAmount - bonusDiscountAmount);
//         }, 0);
//     };

//     return (
//         <Card className="p-4">
//             <CardContent>
//                 <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//                 <div className="space-y-4">
//                     <div className="flex justify-between">
//                         <span>Subtotal:</span>
//                         <span>${calculateTotal().toFixed(2)}</span>
//                     </div>
//                     <div className="space-y-2">
//                         <label className="block text-sm font-medium">Discount Code</label>
//                         <Input
//                             value={discountCode}
//                             onChange={(e) => onDiscountChange(e.target.value)}
//                             placeholder="Enter discount code"
//                         />
//                     </div>
//                     <div className="border-t pt-4">
//                         <div className="flex justify-between font-bold">
//                             <span>Total:</span>
//                             <span>${calculateTotal().toFixed(2)}</span>
//                         </div>
//                     </div>
//                     <Button className="w-full">
//                         Proceed to Checkout
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default CartSummary;
// CartSummary.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCart } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartSummaryProps {
  cartItems: {
    productBatchId: number;
    quantity: number;
  }[];
  productDetails: ProductCart[];
  discountCode: string;
  onDiscountChange: (code: string) => void;
  onCheckout: () => void;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  diningOption: string;
  tableId: string;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onDiningOptionChange: (value: string) => void;
  onTableIdChange: (value: string) => void;
  isLoading: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cartItems,
  productDetails,
  discountCode,
  onDiscountChange,
  onCheckout,
  customerName,
  customerPhone,
  paymentMethod,
  diningOption,
  tableId,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onPaymentMethodChange,
  onDiningOptionChange,
  onTableIdChange,
  isLoading,
}) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const details = productDetails.find(
        (p) => p.productBatchId === item.productBatchId
      );
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">Customer Name</label>
            <Input
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone Number</label>
            <Input
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Payment Method</label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="QR_CODE">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Dining Option</label>
            <Select value={diningOption} onValueChange={onDiningOptionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select dining option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DINE_IN">Dine In</SelectItem>
                <SelectItem value="TAKE_AWAY">Take Away</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Table Number</label>
            <Input
              type="number"
              value={tableId}
              onChange={(e) => onTableIdChange(e.target.value)}
              placeholder="Enter table number"
              required
            />
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
          <Button className="w-full" onClick={onCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;

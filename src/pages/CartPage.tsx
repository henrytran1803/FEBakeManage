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
import { BillRequest, DiningOption, PaymentMethod } from '@/types/Bill';
import { billService } from '@/services/billService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
interface CartProps {
    cartItems: ProductCart[];
    userId: number;
    totalAmount: number;
  }
const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { currentCart, updateItem, removeItem,clearCart } = useCartStore();
    const [productDetails, setProductDetails] = useState<ProductCart[]>([]);
    const [discountCode, setDiscountCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingBill, setIsCreatingBill] = useState(false);  // State để kiểm tra xem đang tạo hóa đơn không
    const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tableId, setTableId] = useState<string>('');
  const [diningOption, setDiningOption] = useState('');
  const { toast } = useToast(); // Toast thông báo
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    

  useEffect(() => {
    const loadProductDetails = async () => {
        try {
            console.log('Sending request with:', { // Thêm log này
                discountCode,
                productBatchCarts: currentCart.carts
            });
            const response = await productService.getProductCart({
                discountCode,
                productBatchCarts: currentCart.carts
            });
            console.log('API Response:', response); // Thêm log này
            setProductDetails(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Chi tiết lỗi:', error); // Sửa log error để xem chi tiết hơn
            setIsLoading(false);
        }
    };

    loadProductDetails();
}, [currentCart.carts, discountCode]);
    
      // Xử lý tạo hóa đơn mới
    //   const handleCreateBill = async () => {
    //     setIsCreatingBill(true);
    //     try {
    //         const billRequest = {
    //             customerName,
    //             customerPhone,
    //             paymentMethod,
    //             diningOption,
    //             productBatchCarts: currentCart.carts // Dữ liệu sản phẩm từ giỏ hàng
    //         };
            
    //         // Gửi yêu cầu tạo hóa đơn
    //         await billService.createBill(billRequest);
    //         alert("Hóa đơn đã được tạo thành công");
    //         navigate("/hoadon");  // Chuyển hướng đến trang danh sách hóa đơn
    //     } catch (error) {
    //         console.error("Không thể tạo hóa đơn:", error);
    //     } finally {
    //         setIsCreatingBill(false);
    //     }
    // };

     // Hàm gọi API tạo hóa đơn khi checkout
  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !paymentMethod || !tableId || !diningOption) {
        toast({
          title: 'Thông báo',
          description: 'Vui lòng điền đầy đủ thông tin!',
          variant: 'destructive',
        });
        return;
      }

    try {
      // Tạo BillRequest từ dữ liệu giỏ hàng
      const billRequest: BillRequest = {
        customerName,
        customerPhone,
        paymentMethod: paymentMethod as PaymentMethod,
        tableId: parseInt(tableId, 10), // Chuyển string sang number khi gửi API
        diningOption: diningOption as DiningOption,
        billDetails: currentCart.carts.map((item) => ({
            productBatchId: item.productBatchId,
            quantity: item.quantity,
        }))
    };
      console.log(billRequest); // In billRequest ra để kiểm tra
      setIsLoading(true);
      const response = await billService.createBill(billRequest);

      // Kiểm tra phản hồi API
      if (response) {
        clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
        if (paymentMethod === 'CASH') {
            setShowSuccessDialog(true); // Hiện dialog cho thanh toán tiền mặt
        } else {
            toast({
                title: 'Thành công',
                description: 'Đơn hàng đã được tạo và thanh toán thành công!',
            });
            navigate('/bills');
        }
      } else {
        // Nếu có lỗi từ API, xử lý lỗi ở đây
        setError('Tạo hóa đơn thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      setError('Có lỗi xảy ra khi tạo hóa đơn.');
    } finally {
      setIsLoading(false);
    }
  };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }
    const handleCloseDialog = () => {
        setShowSuccessDialog(false);
        navigate('/home');
    };

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

             {/* Success Dialog for Cash Payment */}
             <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Đặt hàng thành công!</DialogTitle>
                        <DialogDescription className="space-y-4">
                            <p>Vui lòng ra quầy thanh toán và cung cấp một trong các thông tin sau:</p>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Tên:</span>
                                    <span>{customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Số điện thoại:</span>
                                    <span>{customerPhone}</span>
                                </div>
                                {diningOption === 'DINE_IN' && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Số bàn:</span>
                                        <span>{tableId}</span>
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleCloseDialog}>
                            Đã hiểu
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
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
                                    onCheckout={handleCheckout}  // Truyền hàm handleCheckout vào
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
                    onCheckout={handleCheckout}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    paymentMethod={paymentMethod}
                    diningOption={diningOption}
                    tableId={tableId}
                    onCustomerNameChange={setCustomerName}
                    onCustomerPhoneChange={setCustomerPhone}
                    onPaymentMethodChange={setPaymentMethod}
                    onDiningOptionChange={setDiningOption}
                    onTableIdChange={setTableId}
                    isLoading={isCreatingBill}
                />
                </div>
            </div>
        </div>
    );
};

export default Cart;
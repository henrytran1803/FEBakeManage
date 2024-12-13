{
  /* Success Dialog for Cash Payment
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
            </Dialog> */
}
// Cart.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ProductCart } from "@/types/product";
import { productService } from "@/services/productService.ts";
import CartItem from "@/components/CartItem.tsx";
import CartSummary from "@/components/CartSummary.tsx";
import { useCartStore } from "@/store/useCartStore.ts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BillRequest, DiningOption, PaymentMethod } from "@/types/Bill";
import { billService } from "@/services/billService";
import { useToast } from "@/hooks/use-toast";
import { billApi } from "@/api/endpoints/billApi";
import axios from "axios";
import { paymentApi } from "@/api/endpoints/paymentApi";
import ErrorMessageManager from "@/utils/errorMessages";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { currentCart, updateItem, removeItem, clearCart } = useCartStore();
  const [productDetails, setProductDetails] = useState<ProductCart[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false); // State để kiểm tra xem đang tạo hóa đơn không
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tableId, setTableId] = useState<string>("");
  const [diningOption, setDiningOption] = useState("");
  const { toast } = useToast(); // Toast thông báo
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  useEffect(() => {
    const loadProductDetails = async () => {
      setIsLoadingCart(true);
      try {
        const response = await productService.getProductCart({
          discountCode,
          productBatchCarts: currentCart.carts,
        });
        setProductDetails(response.data);
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadProductDetails();
  }, [currentCart.carts, discountCode]);


    // Thêm useEffect để lấy tableId từ localStorage khi component mount
    useEffect(() => {
      const savedTableId = localStorage.getItem('tableId');
      if (savedTableId) {
        setTableId(savedTableId);
      }
      }, []);

    //

    const handleCheckout = async () => {
      console.log("Form Data:", {
        customerName,
        customerPhone,
        paymentMethod,
        tableId,
        diningOption,
        cartItems: currentCart.carts,
      });
  
        // Kiểm tra validation với mã lỗi
    const errors = [];
    if (!customerName) errors.push('Q10001');
    if (!customerPhone) errors.push('Q10002');
    if (!paymentMethod) errors.push('Q10003');
    if (!tableId) errors.push('Q10004');
    if (!diningOption) errors.push('Q10005');

    if (errors.length > 0) {
      console.log("Validation failed:", {
        customerName: !customerName,
        customerPhone: !customerPhone,
        paymentMethod: !paymentMethod,
        tableId: !tableId,
        diningOption: !diningOption,
      });
      
      const errorMessages = errors.map(code => ({
        code,
        message: ErrorMessageManager.getMessage(code)
      }));

      toast({
        title: `Lỗi: ${errorMessages[0].code}`,
        description: errorMessages.map(e => e.message).join('\n'),
        variant: "destructive",
      });
      return;
    }
  
      try {
        setIsCreatingBill(true);
        const savedTableId = localStorage.getItem('tableId');
        const billRequest: BillRequest = {
          customerName,
          customerPhone,
          paymentMethod: paymentMethod as PaymentMethod,
          tableId: parseInt(savedTableId || "1", 10),
          diningOption: diningOption as DiningOption,
          billDetails: currentCart.carts.map((item) => ({
            productBatchId: item.productBatchId,
            quantity: item.quantity,
          })),
        };
  
        console.log("Sending request:", billRequest);
        const result = await billApi.createBill(billRequest);
        console.log("API Response:", result.data);
  
        if (result?.data?.billId) {
          clearCart();
  
          if (paymentMethod === PaymentMethod.CASH) {
            navigate(`/bills/${result.data.billId}/checkouted`);
            toast({
              title: "Thành công",
              description: "Đặt hàng thành công!",
            });
          } else if (paymentMethod === PaymentMethod.QR_CODE) {
            try {
              const paymentResponse = await paymentApi.getCreatePayment(result.data.billId);
              localStorage.setItem('pendingBillId', result.data.billId.toString());
  
              if (paymentResponse.success === true && paymentResponse.data.checkoutUrl) {
                window.location.href = paymentResponse.data.checkoutUrl;
              } else {
                throw new Error("Không thể tạo link thanh toán");
              }
            } catch (paymentError) {
              console.error("Payment error:", paymentError);
              toast({
                title: "Lỗi",
                description: "Không thể tạo link thanh toán. Vui lòng thử lại!",
                variant: "destructive",
              });
            }
          }
        } else {
          toast({
            title: "Lỗi: "+ result.message,
            description: "Message: "+result.errorcode,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Detailed error:", error);
        let errorMessage = "Có lỗi xảy ra khi tạo đơn hàng.";
  
        if (error instanceof Error) {
          errorMessage = error.message;
        }
  
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsCreatingBill(false);
      }
  };
  if (isLoadingCart) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
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
                  (p) => p.productBatchId === item.productBatchId
                );
                return details ? (
                  <CartItem
                    key={item.productBatchId}
                    item={item}
                    productDetails={details}
                    onUpdateQuantity={updateItem}
                    onRemove={removeItem}
                    onCheckout={handleCheckout} // Truyền hàm handleCheckout vào
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

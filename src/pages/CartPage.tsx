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
import { CartPageErrorCode, cartPageErrorMessages } from "@/utils/error/CartPageError";

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
    const savedTableId = localStorage.getItem("tableId");
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

    // Kiểm tra validation
    const validationErrors = [];
    if (!customerName) validationErrors.push(CartPageErrorCode.CUSTOMER_NAME_REQUIRED);
    if (!customerPhone) validationErrors.push(CartPageErrorCode.PHONE_NUMBER_REQUIRED);
    if (!paymentMethod) validationErrors.push(CartPageErrorCode.PAYMENT_METHOD_REQUIRED);
    if (!tableId) validationErrors.push(CartPageErrorCode.TABLE_REQUIRED);
    if (!diningOption) validationErrors.push(CartPageErrorCode.DINING_OPTION_REQUIRED);

    if (validationErrors.length > 0) {
      // Nếu có nhiều hơn 1 lỗi, hiển thị tất cả
      if (validationErrors.length > 1) {
        toast({
          title: "Vui lòng kiểm tra lại thông tin",
          description: (
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{cartPageErrorMessages[error]}</li>
              ))}
            </ul>
          ),
          variant: "destructive",
        });
      } else {
        // Nếu chỉ có 1 lỗi, hiển thị như cũ
        toast({
          title: "Lỗi",
          description: cartPageErrorMessages[validationErrors[0]],
          variant: "destructive",
        });
      }
      return;
    
    }

    try {
      setIsCreatingBill(true);
      const savedTableId = localStorage.getItem("tableId");
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
            const paymentResponse = await paymentApi.getCreatePayment(
              result.data.billId
            );
            localStorage.setItem(
              "pendingBillId",
              result.data.billId.toString()
            );

            if (
              paymentResponse.success === true &&
              paymentResponse.data.checkoutUrl
            ) {
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
          title: "Lỗi: " + result.message,
          description: "Message: " + result.errorcode,
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
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">Giỏ hàng</h1>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Cart Items */}
        <div className="mb-6">
          <Card>
            {currentCart.carts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Giỏ hàng trống
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
                    onCheckout={handleCheckout}
                  />
                ) : null;
              })
            )}
          </Card>
        </div>

        {/* Summary Card */}
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
  );
};

export default Cart;
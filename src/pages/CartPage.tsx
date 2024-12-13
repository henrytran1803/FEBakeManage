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
import { useToast } from "@/hooks/use-toast";
import { billApi } from "@/api/endpoints/billApi";
import { paymentApi } from "@/api/endpoints/paymentApi";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { currentCart, updateItem, removeItem, clearCart } = useCartStore();
  const [productDetails, setProductDetails] = useState<ProductCart[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tableId, setTableId] = useState<string>("");
  const [diningOption, setDiningOption] = useState("");
  const { toast } = useToast();
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const loadProductDetails = async (code?: string) => {
    setIsLoadingCart(true);
    try {
      const response = await productService.getProductCart({
        discountCode: code || "",
        productBatchCarts: currentCart.carts,
      });
      setProductDetails(response.data);
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      toast({
        title: "Lỗi",
        description: "Không thể áp dụng mã giảm giá. Vui lòng thử lại!",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [currentCart.carts]);

  useEffect(() => {
    const savedTableId = localStorage.getItem("tableId");
    if (savedTableId) {
      setTableId(savedTableId);
    }
  }, []);

  const handleApplyDiscount = async () => {
    setIsApplyingDiscount(true);
    await loadProductDetails(discountCode);
    setIsApplyingDiscount(false);
  };
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
    if (!customerName) {
      showErrorToast(ErrorCode.CUSTOMER_NAME_REQUIRED);
      return;
    }

    if (!customerPhone) {
      showErrorToast(ErrorCode.PHONE_NUMBER_REQUIRED);
      return;
    }

    if (!paymentMethod) {
      showErrorToast(ErrorCode.PAYMENT_METHOD_REQUIRED);
      return;
    }

    if (!tableId) {
      showErrorToast(ErrorCode.TABLE_REQUIRED);
      return;
    }

    if (!diningOption) {
      showErrorToast(ErrorCode.DINING_OPTION_REQUIRED);
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

        <div className="p-4">
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

          <CartSummary
              cartItems={currentCart.carts}
              productDetails={productDetails}
              discountCode={discountCode}
              onDiscountChange={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
              isApplyingDiscount={isApplyingDiscount}
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
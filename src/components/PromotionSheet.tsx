import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { promotionService } from "@/services/promotionService";
import { productBatchService } from "@/services/productBatchService";
import { useCustomToast } from "@/hooks/CustomAlert";
import {
    PromotionCreate,
    PromotionDaily,
    PromotionForDetail,
    PromotionSheetProps,
    PromotionUpdate
} from "@/types/promotion";
import { ProductBatch } from "@/types/productBatch";
import { NormalPromotionForm } from "./NormalPromotionForm";
import { DailyPromotionForm } from "./DailyPromotionForm";
import { ProductSelection } from "./ProductSelection";
import {ErrorCode, validatePromotionDates, validatePromotionName} from "@/utils/error/ErrorCode.ts";

export default function PromotionSheet({
                                           isOpen,
                                           onClose,
                                           promotion,
                                           onSuccess
                                       }: PromotionSheetProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [promotionDetail, setPromotionDetail] = useState<PromotionForDetail | null>(null);
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const [products, setProducts] = useState<ProductBatch[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [initialProducts, setInitialProducts] = useState<number[]>([]);
    const [promotionType, setPromotionType] = useState("normal");
    const [skipDefaultDiscount, setSkipDefaultDiscount] = useState(false);
    const [getLastestDate, setGetLastestDate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = Boolean(promotion);

    useEffect(() => {
        const fetchPromotionDetail = async (id: number) => {
            try {
                setIsLoading(true);
                setError("");
                const response = await promotionService.getPromotionDetail(id);

                if (response.success) {
                    setPromotionDetail(response.data);
                    setName(response.data.name);
                    setDescription(response.data.description);
                    setDiscount(response.data.discount.toString());
                    setStartDate(response.data.startDate.split('T')[0]);
                    setEndDate(response.data.endDate.split('T')[0]);
                    const currentProducts = response.data.promotionDetails.map(
                        detail => detail.id.productBatchId
                    );
                    setSelectedProducts(currentProducts);
                    setInitialProducts(currentProducts);
                }
            } catch (error) {
                setError("Không thể tải thông tin khuyến mãi. Vui lòng thử lại.");
                console.error('Failed to fetch promotion detail:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productBatchService.getAllProductBatches();
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                setError("Không thể tải danh sách sản phẩm.");
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchProducts();
            if (promotion?.id) {
                fetchPromotionDetail(promotion.id);
            } else {
                resetForm();
            }
        }

        return () => {
            resetForm();
        };
    }, [isOpen, promotion?.id]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            if (promotionType === "normal" || isEditing) {
                if (!name.trim()) {
                    showErrorToast(ErrorCode.PROMOTION_NAME_REQUIRED);
                    return;
                }
                if (!validatePromotionName(name)) {
                    showErrorToast(ErrorCode.PROMOTION_NAME_NO_SPECIAL_CHARS);
                    return;
                }
                if (name.length > 250) {
                    showErrorToast(ErrorCode.PROMOTION_NAME_LENGTH);
                    return;
                }

                if (!description.trim()) {
                    showErrorToast(ErrorCode.PROMOTION_DESC_REQUIRED);
                    return;
                }
                if (description.length > 250) {
                    showErrorToast(ErrorCode.PROMOTION_DESC_LENGTH);
                    return;
                }

                // Date validation
                if (!startDate) {
                    showErrorToast(ErrorCode.PROMOTION_START_DATE_REQUIRED);
                    return;
                }
                if (!endDate) {
                    showErrorToast(ErrorCode.PROMOTION_END_DATE_REQUIRED);
                    return;
                }

                const dateError = validatePromotionDates(startDate, endDate);
                if (dateError) {
                    showErrorToast(dateError);
                    return;
                }
            }

            // Common validations
            if (!discount) {
                showErrorToast(ErrorCode.PROMOTION_DISCOUNT_REQUIRED);
                return;
            }
            const discountValue = parseInt(discount);
            if (discountValue < 0 || discountValue > 100) {
                showErrorToast(ErrorCode.PROMOTION_DISCOUNT_RANGE);
                return;
            }

            if (selectedProducts.length === 0) {
                showErrorToast(ErrorCode.PROMOTION_PRODUCTS_REQUIRED);
                return;
            }
            //
            // if (promotionType === "daily" && !isEditing) {
            //     if (!getLastestDate && !endDate) {
            //         showErrorToast(PromotionErrorCode.PROMOTION_DAILY_END_DATE_REQUIRED);
            //         return;
            //     }
            //     if (!getLastestDate) {
            //         const dateError = validatePromotionDates(new Date().toISOString().split('T')[0], endDate);
            //         if (dateError) {
            //             showErrorToast(PromotionErrorCode.PROMOTION_DAILY_END_DATE_INVALID);
            //             return;
            //         }
            //     }
            // }

            // Submit logic
            if (promotionType === "daily" && !isEditing) {
                const dailyPromotionData: PromotionDaily = {
                    discount: discountValue,
                    productBatchIds: selectedProducts,
                    endDate: getLastestDate ? "" : `${endDate}T23:59:59`,
                    skipDefaultDiscount,
                    getLastestDate
                };
                console.log(dailyPromotionData)
                await promotionService.createPromotionDaily(dailyPromotionData);
            } else {
                const formData = {
                    name,
                    description,
                    discount: parseInt(discount),
                    startDate: `${startDate}T00:00:00`,
                    endDate: `${endDate}T23:59:59`,
                };

                if (promotionDetail) {
                    const addedProducts = selectedProducts.filter(
                        id => !initialProducts.includes(id)
                    );
                    const removedProducts = initialProducts.filter(
                        id => !selectedProducts.includes(id)
                    );

                    await promotionService.updatePromotion(
                        promotionDetail.id,
                        formData as PromotionUpdate,
                        addedProducts,
                        removedProducts
                    );
                } else {
                    await promotionService.createPromotion({
                        ...formData,
                        productBatchIds: selectedProducts
                    } as PromotionCreate);
                }
            }

            showSuccessToast(ErrorCode.PROMOTION_POST_SUCCESS);
            onSuccess(true);
            onClose();
            resetForm();
        } catch (error) {
            setError("Không thể lưu khuyến mãi. Vui lòng thử lại.");
            onSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setDiscount("");
        setStartDate("");
        setEndDate("");
        setSelectedProducts([]);
        setInitialProducts([]);
        setPromotionDetail(null);
        setPromotionType("normal");
        setSkipDefaultDiscount(false);
        setGetLastestDate(false);
        setError("");
    };

    const toggleProductSelection = (productId: number) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {isEditing ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}
                    </SheetTitle>
                </SheetHeader>

                {isLoading && (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!isLoading && !error && (
                    <>
                        {!isEditing ? (
                            <Tabs defaultValue="normal" className="mt-4" onValueChange={setPromotionType}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="normal">Khuyến mãi thường</TabsTrigger>
                                    <TabsTrigger value="daily">Khuyến mãi theo ngày</TabsTrigger>
                                </TabsList>

                                <TabsContent value="normal">
                                    <NormalPromotionForm
                                        name={name}
                                        setName={setName}
                                        description={description}
                                        setDescription={setDescription}
                                        discount={discount}
                                        setDiscount={setDiscount}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                </TabsContent>

                                <TabsContent value="daily">
                                    <DailyPromotionForm
                                        discount={discount}
                                        setDiscount={setDiscount}
                                        skipDefaultDiscount={skipDefaultDiscount}
                                        setSkipDefaultDiscount={setSkipDefaultDiscount}
                                        getLastestDate={getLastestDate}
                                        setGetLastestDate={setGetLastestDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="mt-4">
                                <NormalPromotionForm
                                    name={name}
                                    setName={setName}
                                    description={description}
                                    setDescription={setDescription}
                                    discount={discount}
                                    setDiscount={setDiscount}
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                    endDate={endDate}
                                    setEndDate={setEndDate}
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <ProductSelection
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                products={products}
                                selectedProducts={selectedProducts}
                                toggleProductSelection={toggleProductSelection}
                                setSelectedProducts={setSelectedProducts}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit}>
                                {isEditing ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
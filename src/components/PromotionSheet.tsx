// components/PromotionSheet.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    PromotionCreate,
    PromotionDaily,
    PromotionForDetail,
    PromotionSheetProps,
    PromotionUpdate
} from "@/types/promotion";
import { useEffect, useState } from "react";
import { promotionService } from "@/services/promotionService";
import { productBatchService } from "@/services/productBatchService";
import { ProductBatch } from "@/types/productBatch";
import { Search } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {format} from "date-fns";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Switch} from "@/components/ui/switch.tsx";



export default function PromotionSheet({
                                           isOpen,
                                           onClose,
                                           promotion,
                                           onSuccess
                                       }: PromotionSheetProps) {
    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [promotionDetail, setPromotionDetail] = useState<PromotionForDetail | null>(null);

    const [products, setProducts] = useState<ProductBatch[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [initialProducts, setInitialProducts] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [promotionType, setPromotionType] = useState("normal");
    const [skipDefaultDiscount, setSkipDefaultDiscount] = useState(false);
    const [getLastestDate, setGetLastestDate] = useState(false);

    console.log(loading)
    useEffect(() => {
        const fetchPromotionDetail = async (id: number) => {
            try {
                setLoading(true);
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
                console.error('Failed to fetch promotion detail:', error);
            } finally {
                setLoading(false);
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
    }, [isOpen, promotion]);
    const handleSubmit = async () => {
        try {
            if (promotionType === "daily") {
                const dailyPromotionData: PromotionDaily = {
                    discount: parseInt(discount),
                    productBatchIds: selectedProducts,
                    endDate: getLastestDate ? "" : `${endDate}T23:59:59`,
                    skipDefaultDiscount,
                    getLastestDate
                };
                await promotionService.createPromotionDaily(dailyPromotionData);
            } else {
                // Logic cũ cho promotion thường
                const formData = {
                    name,
                    description,
                    discount: parseInt(discount),
                    startDate: `${startDate}T00:00:00`,
                    endDate: `${endDate}T23:59:59`,
                };

                if (promotionDetail) {
                    // Logic update hiện tại
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

            onSuccess(true);
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to save promotion:', error);
            onSuccess(false);
        }
    };
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productBatchService.getAllProductBatches();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
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
    };

    const getDiscountColor = (discount: number) => {
        if (discount >= 50) return "text-red-600 bg-red-50";
        if (discount >= 30) return "text-orange-600 bg-orange-50";
        if (discount >= 10) return "text-yellow-600 bg-yellow-50";
        return "text-green-600 bg-green-50";
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        {promotion ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}
                    </SheetTitle>
                </SheetHeader>

                {!promotion && ( // Chỉ hiện tabs khi tạo mới
                    <Tabs defaultValue="normal" className="mt-4" onValueChange={setPromotionType}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="normal">Khuyến mãi thường</TabsTrigger>
                            <TabsTrigger value="daily">Khuyến mãi theo ngày</TabsTrigger>
                        </TabsList>

                        <TabsContent value="normal">
                            {/* Form hiện tại */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Tên khuyến mãi</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nhập tên khuyến mãi"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Nhập mô tả"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="discount">Phần trăm giảm giá</Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        placeholder="Nhập phần trăm giảm giá"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Ngày bắt đầu</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="endDate">Ngày kết thúc</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                </div>
                        </TabsContent>

                        <TabsContent value="daily">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="dailyDiscount">Phần trăm giảm giá</Label>
                                    <Input
                                        id="dailyDiscount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        placeholder="Nhập phần trăm giảm giá hoặc để trống để sử dụng mặc định"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="skipDefault">Bỏ qua giảm giá mặc định</Label>
                                    <Switch
                                        id="skipDefault"
                                        checked={!skipDefaultDiscount}
                                        onCheckedChange={setSkipDefaultDiscount}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="lastestDate">Sử dụng ngày hết hạn xa nhất</Label>
                                    <Switch
                                        id="lastestDate"
                                        checked={getLastestDate}
                                        onCheckedChange={setGetLastestDate}
                                    />
                                </div>

                                {!getLastestDate && (
                                    <div>
                                        <Label htmlFor="endDate">Ngày kết thúc</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                <div className="space-y-2">
                    <Label>Sản phẩm áp dụng</Label>
                    <div className="relative">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="pl-10"
                        />
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400"/>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {filteredProducts.map(product => (
                            <Collapsible key={product.id}>
                                <CollapsibleTrigger
                                    className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={product.productBatches.some(
                                                batch => selectedProducts.includes(batch.id)
                                            )}
                                            onCheckedChange={() => {
                                                const batchIds = product.productBatches.map(b => b.id);
                                                if (batchIds.every(id => selectedProducts.includes(id))) {
                                                    setSelectedProducts(prev =>
                                                        prev.filter(id => !batchIds.includes(id))
                                                    );
                                                } else {
                                                    setSelectedProducts(prev =>
                                                        [...new Set([...prev, ...batchIds])]
                                                    );
                                                }
                                            }}
                                        />
                                        <span>{product.name}</span>

                                    </div>
                                    <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {product.productBatches.length} lô
                </span>
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="pl-8 space-y-1">
                                    {product.productBatches.map(batch => (
                                        <div
                                            key={batch.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={selectedProducts.includes(batch.id)}
                                                    onCheckedChange={() => toggleProductSelection(batch.id)}
                                                />
                                                <span className="text-sm">
                      Lô #{batch.id} - HSD: {format(new Date(batch.dateExpiry), 'dd/MM/yyyy')}
                                                    {batch.dailyDiscount > 0 && (
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded ${getDiscountColor(batch.dailyDiscount)}`}>
                                                Giảm {batch.dailyDiscount}%/ngày
                                              </span>
                                                    )}
                    </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {batch.currentDiscount > 0 && (
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${getDiscountColor(batch.currentDiscount)}`}>
                                                -{batch.currentDiscount}%
                                              </span>
                                                )}
                                                {batch.countDown > 0 && (
                                                    <span className="text-xs text-gray-500">
                        (còn {batch.countDown} ngày)
                      </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit}>
                        {promotion ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
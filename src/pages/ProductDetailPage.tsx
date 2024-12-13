import {useNavigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { DetailProductActiveResponse } from "@/types/product";
import { productService } from "@/services/productService";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getImageUrl } from "@/utils/imageUtils.ts";
import { useCartStore } from '@/store/useCartStore';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {useToast} from "@/hooks/use-toast.ts";
import {Price} from "@/types/price.ts";
import {ArrowLeft} from "lucide-react";
export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<DetailProductActiveResponse>();
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { currentCart, addItem } = useCartStore();
    const { toast } = useToast();
    const [priceData, setPriceData] = useState<Price[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                const data = await productService.getDetailProduct(Number(id));
                setProduct(data);
                setPriceData(data.prices);
                if (data.active.imageUrls.length > 0) {
                    setSelectedImage(data.active.imageUrls[0]);
                }
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return null;

    const selectedBatch = selectedBatchId
        ? product.active.productBatches.find(batch => batch.id === selectedBatchId)
        : null;
    const handleAddToCart = () => {
        console.log(currentCart)
        if (!selectedBatch) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Vui lòng chọn lô hàng",
            });
            return;
        }

        const cartItem = {
            productBatchId: selectedBatch.id,
            quantity: quantity
        };

        addItem(cartItem);
        toast({
            title: "Đã thêm vào giỏ hàng",
            description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
        });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header cố định */}
            <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="mr-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold truncate">{product?.active.name}</h1>
            </div>

            <div className="p-4 pb-20">
                {/* Image Section */}
                <div className="space-y-4 mb-6">
                    <div className="w-full aspect-square relative rounded-lg overflow-hidden border">
                        <img
                            src={getImageUrl(selectedImage || product.active.imageUrls[0])}
                            alt={product.active.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Image Carousel */}
                    <div className="relative">
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2">
                                {product.active.imageUrls.map((image, index) => (
                                    <CarouselItem key={index} className="pl-2 basis-1/4">
                                        <div
                                            className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                                selectedImage === image ? 'border-primary' : 'border-transparent'
                                            }`}
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.active.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-2 h-8 w-8"/>
                            <CarouselNext className="-right-2 h-8 w-8"/>
                        </Carousel>
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Danh mục: <span className="font-medium">{product.active.category.name}</span>
                        </p>
                        <h2 className="text-2xl font-bold">{product.active.currentPrice.toLocaleString()}đ</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.active.description}</p>
                    </div>

                    {/* Product Batch Selection */}
                    <div className="space-y-3">
                        <Select
                            value={selectedBatchId?.toString()}
                            onValueChange={(value) => setSelectedBatchId(Number(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn lô hàng"/>
                            </SelectTrigger>
                            <SelectContent>
                                {product.active.productBatches
                                    .filter(batch => batch.status)
                                    .map((batch) => (
                                        <SelectItem key={batch.id} value={batch.id.toString()}>
                                            {`HSD: ${new Date(batch.expirationDate).toLocaleDateString()} - Giảm: ${batch.dailyDiscount}%`}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        {/* Quantity Selection */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                            <span className="text-sm font-medium">Số lượng:</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        {/* Price Info */}
                        {selectedBatch && (
                            <div className="bg-white rounded-lg p-3 border space-y-1">
                                <p className="text-sm">Giảm giá: <span className="text-red-500 font-medium">{selectedBatch.dailyDiscount}%</span></p>
                                <p className="font-bold">
                                    Giá sau giảm: {(product.active.currentPrice * (1 - selectedBatch.dailyDiscount / 100)).toLocaleString()}đ
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Price History Chart */}
                    <Card className="mt-6">
                        <CardContent className="p-4">
                            <h3 className="text-base font-semibold mb-4">Lịch sử giá</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceData}>
                                        <XAxis
                                            dataKey="date"
                                            tick={{fontSize: 12}}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                        />
                                        <YAxis
                                            tick={{fontSize: 12}}
                                            width={70}
                                            tickFormatter={value => `${(value/1000)}k`}
                                        />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="price" stroke="#2563eb" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <Button
                    className="w-full h-12"
                    onClick={handleAddToCart}
                    disabled={!selectedBatch}
                >
                    Thêm vào giỏ hàng
                </Button>
            </div>
        </div>
    );
}
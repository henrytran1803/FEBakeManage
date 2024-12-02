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
        <div className="fixed inset-0 bg-gray-50">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 flex items-center gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
                    <div className="w-full relative rounded-xl overflow-hidden border shadow-sm flex-1">
                        <img
                            src={getImageUrl(selectedImage || product.active.imageUrls[0])}
                            alt={product.active.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="relative">
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {product.active.imageUrls.map((image, index) => (
                                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4">
                                        <div
                                            className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                                ${selectedImage === image ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
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
                            <CarouselPrevious className="-left-4"/>
                            <CarouselNext className="-right-4"/>
                        </Carousel>
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">{product.active.name}</h1>
                        <p className="text-gray-600 leading-relaxed">{product.active.description}</p>
                    </div>

                    <div className="space-y-2">
                        <span className="text-3xl font-bold text-primary">
                            {product.active.currentPrice.toLocaleString()}đ
                        </span>
                        <p className="text-sm text-gray-600">
                            Danh mục: <span className="font-medium">{product.active.category.name}</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chọn lô hàng:</label>
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
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </Button>
                            <span className="w-12 text-center">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </Button>
                        </div>

                        {selectedBatch && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Giảm giá: {selectedBatch.dailyDiscount}%
                                </p>
                                <p className="text-xl font-bold">
                                    Giá sau
                                    giảm: {(product.active.currentPrice * (1 - selectedBatch.dailyDiscount / 100)).toLocaleString()}đ
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={!selectedBatch}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                        <Card className="shadow-lg mb-8">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-6">Lịch sử giá</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={priceData}>
                                            <XAxis
                                                dataKey="date"
                                                tick={{fill: '#6B7280'}}
                                                tickLine={{stroke: '#E5E7EB'}}
                                            />
                                            <YAxis
                                                tick={{fill: '#6B7280'}}
                                                tickLine={{stroke: '#E5E7EB'}}
                                                width={80}
                                                tickFormatter={value => `${value.toLocaleString()}đ`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'white',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                formatter={value => [`${value.toLocaleString()}đ`]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="price"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                dot={{fill: '#2563eb', strokeWidth: 2}}
                                                activeDot={{r: 6}}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
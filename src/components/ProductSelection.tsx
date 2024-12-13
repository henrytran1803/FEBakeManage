import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ProductBatch } from "@/types/productBatch";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProductSelectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    products: ProductBatch[];
    selectedProducts: number[];
    toggleProductSelection: (productId: number) => void;
    setSelectedProducts: (callback: (prev: number[]) => number[]) => void;
}

export function ProductSelection({
                                     searchTerm,
                                     setSearchTerm,
                                     products,
                                     selectedProducts,
                                     toggleProductSelection,
                                     setSelectedProducts
                                 }: ProductSelectionProps) {
    const getDiscountColor = (discount: number) => {
        if (discount >= 50) return "text-red-600 bg-red-50";
        if (discount >= 30) return "text-orange-600 bg-orange-50";
        if (discount >= 10) return "text-yellow-600 bg-yellow-50";
        return "text-green-600 bg-green-50";
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
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
                                                    className={`ml-2 text-xs px-2 py-1 rounded ${getDiscountColor(batch.dailyDiscount)}`}>
                                                    Giảm {batch.dailyDiscount}%/ngày
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {batch.dailyDiscount > 0 && (
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${getDiscountColor(batch.dailyDiscount)}`}>
                                                -{batch.dailyDiscount}%
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
    );
}
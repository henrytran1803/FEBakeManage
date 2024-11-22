// components/SearchFilter.tsx
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingCart} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";

export const SearchFilter = ({
                                 searchTerm,
                                 setSearchTerm,
                                 sortBy,
                                 setSortBy,
                                 sortDirection,
                                 setSortDirection
                             }: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (value: 'asc' | 'desc') => void;
}) => {
    const navigate = useNavigate();
    const currentCart = useCartStore(state => state.currentCart);
    const totalItems = currentCart?.carts.reduce((sum, item) => sum + item.quantity, 0) || 0;
    console.log(currentCart)
    return (
        <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Tên sản phẩm</SelectItem>
                        <SelectItem value="currentPrice">Giá</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortDirection} onValueChange={setSortDirection}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                        <SelectItem value="desc">Giảm dần</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative">
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/cart')}
                >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Giỏ hàng</span>
                </Button>
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                        {totalItems}
                    </span>
                )}
            </div>
        </div>
    );
};
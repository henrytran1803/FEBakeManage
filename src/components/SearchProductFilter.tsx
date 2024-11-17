import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {SearchProductFilterProps} from "@/types/product.ts";
import {Badge} from "@/components/ui/badge.tsx";



export function SearchProductFilter({
                                        searchTerm,
                                        setSearchTerm,
                                        activeFilter,
                                        setActiveFilter,
                                        sortConfig,
                                        setSortConfig,
                                        priceRange,
                                        setPriceRange,
                                        setPage,
                                    }: SearchProductFilterProps) {
    const handleClearFilter = (filterType: 'search' | 'status' | 'price') => {
        setPage(0);
        switch (filterType) {
            case 'search':
                setSearchTerm('');
                break;
            case 'status':
                setActiveFilter('all');
                break;
            case 'price':
                setPriceRange({ min: null, max: null });
                break;
        }
    };

    const hasActiveFilters = searchTerm || activeFilter !== 'all' || priceRange.min || priceRange.max;


    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[300px] relative">
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                        className="pl-10"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="flex gap-4">
                    {/* Sort Select */}
                    <Select
                        value={sortConfig}
                        onValueChange={(value: 'asc' | 'desc') => {
                            setSortConfig(value);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Tên (A-Z)</SelectItem>
                            <SelectItem value="desc">Tên (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Select */}
                    <Select
                        value={activeFilter}
                        onValueChange={(value: 'all' | 'active' | 'inactive') => {
                            setActiveFilter(value);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang bán</SelectItem>
                            <SelectItem value="inactive">Ngừng bán</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Price Range Inputs */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Giá từ"
                            value={priceRange.min || ''}
                            onChange={(e) => {
                                setPriceRange((prev: { min: number | null; max: number | null }) => ({
                                    ...prev,
                                    min: e.target.value ? Number(e.target.value) : null,
                                }));
                                setPage(0);
                            }}
                            className="w-24"
                        />

                        <span>-</span>
                        <Input
                            type="number"
                            placeholder="Đến"
                            value={priceRange.max || ''}
                            onChange={(e) => {
                                setPriceRange((prev: { min: number | null; max: number | null }) => ({
                                    ...prev,
                                    max: e.target.value ? Number(e.target.value) : null,
                                }));
                                setPage(0);
                            }}
                            className="w-24"
                        />

                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Tìm kiếm: {searchTerm}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleClearFilter('search')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {activeFilter !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Trạng thái: {activeFilter === 'active' ? 'Đang bán' : 'Ngừng bán'}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleClearFilter('status')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {(priceRange.min || priceRange.max) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Giá: {priceRange.min || 0} - {priceRange.max || '∞'}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleClearFilter('price')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import { SearchFilter } from "@/components/SearchFilter";
import { TablePagination } from "@/components/TablePagination";
import {SearchProductActiveParams, SearchProductActiveResponse} from "@/types/product.ts";
import { Category } from "@/types/Category.ts";
import { categoryService } from "@/services/categoryService.ts";
import { productService } from "@/services/productService.ts";
import { ArrowUpDown, Menu, Search, ShoppingCart, X } from 'lucide-react';
import {useParams} from "react-router-dom";
import {useCartStore} from "@/store/useCartStore.ts";
import Header from "@/components/Header.tsx";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";

export default function HomePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [products, setProducts] = useState<SearchProductActiveResponse[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setTable,addItem } = useCartStore();

    

    useEffect(() => {
        if (id) {
            setTable(id)
        }else{
            setTable('1')
        }
        const fetchCategories = async () => {
            const data = await categoryService.getAllCategories();
            setCategories(data.data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const params : SearchProductActiveParams = {
                page: page,
                size: size,
                productName: searchTerm,
                categoryIds: selectedCategories,
                sortBy: sortBy,
                sortDirection: sortDirection
            };
            const data = await productService.searchActive(params);
            setProducts(data.data.content);
            setTotalPages(data.data.totalPages);
            setTotalElements(data.data.totalElements);
        };
        fetchProducts();
    }, [page, size, searchTerm, selectedCategories, sortBy, sortDirection]);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
        setPage(0);
    };

    const toggleSortDirection = () => {
        setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="w-full px-2 py-2">
                {/* Mobile Category Button */}
                <div className="mb-3">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="w-full p-2.5 bg-white shadow rounded-lg flex items-center justify-center gap-2"
                    >
                        <Menu size={18} />
                        <span className="text-sm">Danh mục sản phẩm</span>
                    </button>
                </div>

                {/* Search and Sort - Thiết kế mới cho mobile */}
                <div className="mb-3 space-y-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border shadow-sm focus:ring-1 focus:ring-blue-500"
                        />
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    </div>

                    <button
                        onClick={toggleSortDirection}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-white rounded-lg border shadow-sm"
                    >
                        <ArrowUpDown size={16} />
                        <span className="text-sm">
                            Giá: {sortDirection === 'asc' ? 'Thấp đến cao' : 'Cao đến thấp'}
                        </span>
                    </button>
                </div>

                {/* Mobile Category Modal */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Danh mục</h2>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            handleCategoryChange(category.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full p-2.5 text-left border rounded-lg ${
                                            selectedCategories.includes(category.id)
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <span className="text-sm">{category.name}</span>
                                        {selectedCategories.includes(category.id) && (
                                            <span className="float-right text-blue-500">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {products.map(product => {
                        const discount = product.maxDailyDiscount || 0;
                        const finalPrice = product.price * (1 - discount / 100);
                        
                        return (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="h-full hover:shadow-lg transition-shadow cursor-pointer group relative w-[45vw]"
                            >
                                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                    {discount > 0 && (
                                        <Badge className="bg-red-500 text-white">
                                            -{discount}%
                                        </Badge>
                                    )}
                                    <Badge variant="secondary">
                                        Còn {product.totalQuantity} sản phẩm
                                    </Badge>
                                </div>
                                <Card>
                                    <CardHeader className="p-0">
                                        <img
                                            src={getImageUrl(product.imageUrl) || "/placeholder.png"}
                                            alt={product.name}
                                            className="h-[20vh] w-full object-cover rounded-t-lg"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{product.categoryName}</p>
                                        <div className="mt-2 flex flex-col">
                                            <span className="text-sm font-bold text-primary">
                                                {finalPrice.toLocaleString()}đ
                                            </span>
                                            {discount > 0 && (
                                                <span className="text-xs text-gray-500 line-through">
                                                    {product.price.toLocaleString()}đ
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            addItem(product);
                        }}
                        className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary/90"
                    >
                        <ShoppingCart size={16} />
                    </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="mt-3 mb-6">
                        <TablePagination
                            page={page}
                            setPage={setPage}
                            size={size}
                            setSize={setSize}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            currentPageElements={products.length}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
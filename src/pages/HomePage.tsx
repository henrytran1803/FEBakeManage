import { useEffect, useState } from "react";
import { SearchFilter } from "@/components/SearchFilter";
import { ProductCard } from "@/components/ProductCard";
import { TablePagination } from "@/components/TablePagination";
import {SearchProductActiveParams, SearchProductActiveResponse} from "@/types/product.ts";
import { Category } from "@/types/Category.ts";
import { categoryService } from "@/services/categoryService.ts";
import { productService } from "@/services/productService.ts";
import { CategoryListForCheckBox } from "@/components/CategoryListForCheckBox.tsx";
import { Menu, X } from 'lucide-react';
import {useParams} from "react-router-dom";
import {useCartStore} from "@/store/useCartStore.ts";

export default function HomePage() {
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
    const { setTable } = useCartStore();

    useEffect(() => {
        if (id) {
            setTable(id)
        }else{
            setTable('1')
        }
        console.log(id)
        console.log(localStorage.getItem('tableId'));
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

    const handleCategoryChange = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
        setPage(0);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-2">
                <SearchFilter
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                />
                
                {/* Mobile Category Toggle */}
                <div className="lg:hidden flex justify-end my-2">
                    <button 
                        onClick={toggleMobileMenu} 
                        className="p-2 bg-blue-500 text-white rounded-lg flex items-center"
                    >
                        {isMobileMenuOpen ? <X className="mr-2" /> : <Menu className="mr-2" />}
                        {isMobileMenuOpen ? 'Đóng' : 'Danh mục'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Categories Sidebar */}
                    <div className={`
                        ${isMobileMenuOpen 
                            ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' 
                            : 'hidden'} 
                        lg:block lg:static lg:w-1/4
                        transition-all duration-300 ease-in-out
                    `}>
                        <div className="lg:hidden flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Danh mục</h2>
                            <button onClick={toggleMobileMenu} className="text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <CategoryListForCheckBox
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        {products.length > 0 && (
                            <div className="mt-6 flex justify-center">
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
            </div>
        </div>
    );
}
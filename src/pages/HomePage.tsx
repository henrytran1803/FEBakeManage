import { useEffect, useState } from "react";
import { SearchFilter } from "@/components/SearchFilter";
import { ProductCard } from "@/components/ProductCard";
import { TablePagination } from "@/components/TablePagination";
import {SearchProductActiveParams, SearchProductActiveResponse} from "@/types/product.ts";
import { Category } from "@/types/Category.ts";
import { categoryService } from "@/services/categoryService.ts";
import { productService } from "@/services/productService.ts";
import { CategoryListForCheckBox } from "@/components/CategoryListForCheckBox.tsx";

export default function HomePage() {
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

    useEffect(() => {
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
    };

    return (
        <div className="fixed inset-0 bg-gray-50">
            <SearchFilter
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
            />
            <div className="container mx-auto p-4">
                <div className="flex gap-6">
                    <aside>
                        <CategoryListForCheckBox
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                        />
                    </aside>
                    <main className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="mt-6">
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
                    </main>
                </div>
            </div>
        </div>
    );
}

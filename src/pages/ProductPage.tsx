// ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { PlusCircle, Clock } from 'lucide-react';
import { productService } from '@/services/productService';
import { SearchProductFilter } from '@/components/SearchProductFilter';
import { ProductTable } from '@/components/ProductTable';
import { TablePagination } from '@/components/TablePagination';
import { Button } from "@/components/ui/button";
import { Product, PriceRange } from '@/types/product';
import LoadingScreen from "@/pages/LoadingScreen.tsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {ProductFormSheet} from "@/components/ProductFormSheet.tsx";
import {useNavigate} from "react-router-dom";

const ProductPage: React.FC = () => {
    // State declarations
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortConfig, setSortConfig] = useState<'asc' | 'desc'>('asc');
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: null, max: null });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenActive, setIsDeleteOpenActive] = useState(false);
    const [idDelete, setIdDelete] = useState(0);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const status = activeFilter === 'all'
                ? undefined
                : activeFilter === 'active';

            const response = await productService.searchProducts({
                page,
                size,
                sortBy: 'name',
                sortDir: sortConfig,
                name: searchTerm || undefined,
                status,
                minPrice: priceRange.min || undefined,
                maxPrice: priceRange.max || undefined
            });

            if (response.success) {
                const { content, totalPages, totalElements } = response.data;
                console.log( content)
                setProducts(content);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, size, searchTerm, activeFilter, sortConfig, priceRange]);

    // Handlers
    const handleCreate = () => {
        setSelectedProductId(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        console.log(product)
        setSelectedProductId(product.id);
        setIsFormOpen(true);
    };

    const handleStatusChange = (id: number, currentStatus: boolean) => {
        if (currentStatus) {
            setIsDeleteOpen(true);
            setIdDelete(id)
        }else {
            setIsDeleteOpenActive(true);
            setIdDelete(id)

        }
    };
    const navigate = useNavigate();

    const handleOpenManageExpiry = () => {
        navigate("/admin/manageexpiry")
    }
    const handleDeleteConfirm = async () => {
        try {
            const response = await productService.updateStatus(idDelete);
            if (response.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to change product status:', error);
            alert('Có lỗi xảy ra khi thay đổi trạng thái sản phẩm');
        }
    }
    // const handleFormClose = () => {
    //     setIsFormOpen(false);
    //     setSelectedProductId(null);
    //     setIsEdit(false);
    // };
    //
    // const handleFormSuccess = () => {
    //     setIsFormOpen(false);
    //     setSelectedProductId(null);
    //     setIsEdit(false);
    //     fetchProducts();
    // };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="p-4 min-w-[85vw]">
            <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>

            <SearchProductFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                setPage={setPage}
            />

            <div className="flex justify-between items-center my-6">
                <Button
                    onClick={handleCreate}
                    className="inline-flex items-center"
                >
                    <PlusCircle className="w-5 h-5 mr-2"/>
                    Thêm sản phẩm
                </Button>

                <Button
                    variant="outline"
                    className="inline-flex items-center"
                    onClick={handleOpenManageExpiry}
                >
                    <Clock className="w-5 h-5 mr-2"/>
                    Quản lý hạn sử dụng
                </Button>
            </div>

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
            />

            <TablePagination
                page={page}
                setPage={setPage}
                size={size}
                setSize={setSize}
                totalPages={totalPages}
                totalElements={totalElements}
                currentPageElements={products.length}
            />

            <AlertDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm này?
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
                open={isDeleteOpenActive}
                onOpenChange={setIsDeleteOpenActive}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận kích hoạt lại</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn kích hoạt sản phẩm này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Kích hoạt
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <ProductFormSheet
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                    setIsFormOpen(false);
                    fetchProducts();
                }}
                productId={selectedProductId}
            />
        </div>
    );
};

export default ProductPage;
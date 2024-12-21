import { useEffect, useState } from "react";
import LoadingScreen from "@/pages/LoadingScreen";
import { SearchFilter } from "@/components/SearchCategoryFilter";
import CategoryList from "@/components/CategoryList";
import { TablePagination } from "@/components/TablePagination";
import { Category } from "@/types/Category";
import { categoryService } from "@/services/categoryService";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useToast} from "@/hooks/use-toast.ts";
import CategorySheet from "@/components/CategorySheet.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {CheckCircle, ExpandIcon} from "lucide-react";

export function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortConfig, setSortConfig] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenActive, setIsDeleteOpenActive] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'error' | 'success';
        title: string;
        message: string;
    }>({
        show: false,
        type: 'success',
        title: '',
        message: ''
    });
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const { toast } = useToast();
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.searchCategories({
                page,
                size,
                search: searchTerm,
                activeFilter,
                sortConfig,
            });

            if (response.success) {
                const { content, totalPages: total, totalElements: elements } = response.data;
                setCategories(content);
                setTotalPages(total);
                setTotalElements(elements);

            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể tải danh sách danh mục",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, size, searchTerm, activeFilter, sortConfig]);
    const handleCategoryAdded = () => {
        setSelectedCategory(undefined);
        setIsSheetOpen(true);
        fetchCategories();
    };

    const showAlert = (type: 'error' | 'success', title: string, message: string) => {
        setAlert({
            show: true,
            type,
            title,
            message
        });
        // Auto hide after 3 seconds
        setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };
    const onSuccess = (isSuccess: boolean) => {
        if (isSuccess) {
            showAlert('success', 'Thành công', 'Cập nhật danh mục thành công');
            fetchCategories()
        }else {
            showAlert('error', 'Lỗi', 'Kích thước file không được vượt quá 5MB');

        }
    }
    const handleCategoryUpdated = (category: Category) => {
        setSelectedCategory(category);
        setIsSheetOpen(true);
        fetchCategories();
    };
    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category.id);
        if (category.isActive){
            setIsDeleteOpen(true);
        }else {
            setIsDeleteOpenActive(true);
        }


    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            const response = await categoryService.deleteCategory(categoryToDelete);
            if (response.success) {
                toast({
                    title: "Thành công",
                    description: "Đã xóa danh mục",
                });
                fetchCategories();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể xóa danh mục",
            });
        } finally {
            setIsDeleteOpen(false);
            setIsDeleteOpenActive(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <div className="p-4 min-w-[85vw]">
            {loading ? (
            <LoadingScreen />
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-6">Quản lý danh mục</h1>
                    <SearchFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        setPage={setPage}
                    />

                    <CategoryList
                        categories={categories}
                        onCategoryAdded={handleCategoryAdded}
                        onCategoryDeleted={handleDeleteClick}
                        onCategoryUpdated={handleCategoryUpdated}
                    />

                    <TablePagination
                        page={page}
                        setPage={setPage}
                        size={size}
                        setSize={setSize}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        currentPageElements={categories.length}
                    />

                    <AlertDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa danh mục này?
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
                                    Bạn có chắc chắn muốn kích hoạt danh mục này?
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
                    {alert.show && (
                        <Alert variant={alert.type === 'error' ? "destructive" : "default"} className="mt-4">
                            {alert.type === 'error' ? (
                                <ExpandIcon className="h-4 w-4" />
                            ) : (
                                <CheckCircle className="h-4 w-4" />
                            )}
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>
                                {alert.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    <CategorySheet
                        isOpen={isSheetOpen}
                        onClose={() => setIsSheetOpen(false)}
                        category={selectedCategory}
                        onSuccess={onSuccess}
                    />
                </>
            )}
        </div>
    );
}
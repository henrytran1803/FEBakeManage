import { useEffect, useState } from "react";
import LoadingScreen from "@/pages/LoadingScreen";
import { PromotionSearchFilter } from "@/components/PromotionSearchFilter";
import PromotionList from "@/components/PromotionList";
import { TablePagination } from "@/components/TablePagination";
import { Promotion } from "@/types/promotion";
import { promotionService } from "@/services/promotionService";
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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, ExpandIcon } from "lucide-react";
import PromotionSheet from "@/components/PromotionSheet.tsx";

export function PromotionPage() {
    // States
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'name',
        sortDir: 'asc' as 'asc' | 'desc'
    });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenActive, setIsDeleteOpenActive] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | undefined>(undefined);
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
    const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
    const { toast } = useToast();

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await promotionService.searchPromotions({
                page,
                size,
                sortBy: sortConfig.sortBy,
                sortDir: sortConfig.sortDir,
                name: searchTerm,
                isActive: activeFilter === 'all' ? undefined : activeFilter === 'active'
            });

            if (response.success) {
                const { content, totalPages: total, totalElements: elements } = response.data;
                setPromotions(content);
                setTotalPages(total);
                setTotalElements(elements);
                console.log(response)
                console.log(promotions)

            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể tải danh sách khuyến mãi",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, [page, size, searchTerm, activeFilter, sortConfig, dateFilter]);

    const showAlert = (type: 'error' | 'success', title: string, message: string) => {
        setAlert({
            show: true,
            type,
            title,
            message
        });
        setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };
    console.log(showAlert)
    const handlePromotionAdded = () => {
        setSelectedPromotion(undefined);
        setIsSheetOpen(true);
    };

    const handlePromotionUpdated = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (promotion: Promotion) => {
        setPromotionToDelete(promotion.id);
        if (promotion.isActive) {
            setIsDeleteOpen(true);
        } else {
            setIsDeleteOpenActive(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!promotionToDelete) return;

        try {
            const response = await promotionService.deletePromotion(promotionToDelete);
            if (response.success) {
                toast({
                    title: "Thành công",
                    description: "Đã cập nhật trạng thái khuyến mãi",
                });
                fetchPromotions();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể cập nhật trạng thái khuyến mãi",
            });
        } finally {
            setIsDeleteOpen(false);
            setIsDeleteOpenActive(false);
            setPromotionToDelete(null);
        }
    };

    return (
        <div className="p-4 min-w-[85vw]">
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-6">Quản lý khuyến mãi</h1>
                    <PromotionSearchFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        setPage={setPage}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                    />

                    <PromotionList
                        promotions={promotions}
                        onPromotionAdded={handlePromotionAdded}
                        onPromotionDeleted={handleDeleteClick}
                        onPromotionUpdated={handlePromotionUpdated}
                    />

                    <TablePagination
                        page={page}
                        setPage={setPage}
                        size={size}
                        setSize={setSize}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        currentPageElements={promotions.length}
                    />

                    <AlertDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận vô hiệu hóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn vô hiệu hóa khuyến mãi này?
                                    Các sản phẩm trong khuyến mãi sẽ không còn được áp dụng giảm giá.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Vô hiệu hóa
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
                                <AlertDialogTitle>Xác nhận kích hoạt</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn kích hoạt lại khuyến mãi này?
                                    Tất cả sản phẩm trong khuyến mãi sẽ được áp dụng giảm giá.
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


                    <PromotionSheet
                        isOpen={isSheetOpen}
                        onClose={() => setIsSheetOpen(false)}
                        promotion={selectedPromotion}
                        onSuccess={(success) => {
                            if (success) {
                                showAlert('success', 'Thành công', selectedPromotion
                                    ? 'Cập nhật khuyến mãi thành công'
                                    : 'Thêm khuyến mãi thành công'
                                );
                                fetchPromotions();
                            } else {
                                showAlert('error', 'Lỗi', 'Có lỗi xảy ra');
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { billService } from '@/services/billService';
import { useToast } from '@/hooks/use-toast';
import { BillResponse_View_Cake, BillStatus } from '@/types/Bill';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { billApi } from '@/api/endpoints/billApi';

const CheckoutedBill: React.FC = () => {
    const { billId } = useParams<{ billId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [billDetails, setBillDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBillDialog, setShowBillDialog] = useState(false);
    const [billList, setBillList] = useState<BillResponse_View_Cake>();
    const [isLoadingBills, setIsLoadingBills] = useState(false);

    // Load chi tiết đơn hàng hiện tại
    useEffect(() => {
        const loadBillDetails = async () => {
            if (!billId) {
                setError('Không tìm thấy mã đơn hàng');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const response = await billService.getDetailsById(Number(billId));
                
                if (!response) {
                    throw new Error('Không nhận được phản hồi từ server');
                }
                
                setBillDetails(response);
            } catch (error) {
                console.error('Error loading bill details:', error);
                setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải thông tin đơn hàng');
            } finally {
                setIsLoading(false);
            }
        };

        loadBillDetails();
    }, [billId]);

    const loadBillList = async () => {
        try {
            setIsLoadingBills(true);
            const response = await billService.getDetailsById(Number(billId));
            if (response && response.billDetails) {
                setBillList(response);
            }
        } catch (error) {
            console.error('Error loading bill list:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải danh sách đơn hàng',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingBills(false);
        }
    };

    const handleViewBillList = async () => {
        setShowBillDialog(true);
        await loadBillList();
    };

    const handleCancelBill = async () => {
        try {
            await billApi.updateBillStatus(Number(billId), BillStatus.CANCEL);
            toast({
                title: 'Thành công',
                description: 'Đã hủy đơn hàng thành công',
            });
            navigate(`/bills/${billId}/cancelCash`);
        } catch (error) {
            console.error('Error cancelling bill:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể hủy đơn hàng',
                variant: 'destructive',
            });
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Thông tin đơn hàng</h1>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h2 className="font-medium mb-2">Thông tin khách hàng:</h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Tên:</span> {billDetails?.customerName}</p>
                                <p><span className="font-medium">Số điện thoại:</span> {billDetails?.customerPhone}</p>
                                {billDetails?.diningOption === 'DINE_IN' && (
                                    <p><span className="font-medium">Số bàn:</span> {billDetails?.tableId}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h2 className="font-medium mb-2">Hướng dẫn thanh toán:</h2>
                            {billDetails?.paymentMethod === 'CASH' ? (
                                <p>Vui lòng ra quầy thanh toán và cung cấp tên hoặc số điện thoại của bạn.</p>
                            ) : (
                                <p>Đơn hàng của bạn sẽ được xử lý sau khi thanh toán hoàn tất.</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={handleViewBillList}>
                                Xem danh sách đơn hàng
                            </Button>
                            <Button variant="destructive" onClick={handleCancelBill}>
                                Hủy đơn hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
    <DialogContent className="max-w-4xl">
        <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {isLoadingBills ? (
                <div className="text-center py-4">Đang tải chi tiết đơn hàng...</div>
            ) : !billList?.billDetails?.length ? (
                <div className="text-center py-4">Không có sản phẩm nào</div>
            ) : (
                <div className="grid gap-4">
                    {billList.billDetails.map((item) => (
                        <div 
                            key={item.id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.productImages || '/api/placeholder/100/100'}
                                    alt={item.productName}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg mb-2">{item.productName}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-600">
                                            Số lượng: {item.quantity}
                                        </p>
                                        <p className="font-medium">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(item.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </DialogContent>
</Dialog>
        </>
    );
};

export default CheckoutedBill;
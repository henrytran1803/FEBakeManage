import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { billService } from '@/services/billService';
import { BillStatus } from '@/types/Bill';
import { useToast } from '@/hooks/use-toast';

const QRSuccessPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { billId } = useParams();

  useEffect(() => {
    const updatePaymentStatus = async () => {
     
      
      if (!billId) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy thông tin đơn hàng',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        await billService.updateBillStatus(Number(billId), BillStatus.PAID);
        toast({
          title: 'Thành công',
          description: 'Thanh toán thành công!',
        });
        // Xóa billId khỏi localStorage sau khi xử lý xong
        localStorage.removeItem('pendingBillId');
      } catch (error) {
        console.error('Error updating bill status:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật trạng thái đơn hàng',
          variant: 'destructive',
        });
      }
    };

    updatePaymentStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Thanh Toán Thành Công!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được thanh toán thành công. 
              Chúng tôi sẽ sớm xử lý đơn hàng của bạn.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
         
              
              <Button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto"
              >
                Về Trang Chủ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRSuccessPage;
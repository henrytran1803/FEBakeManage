import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { billService } from '@/services/billService';
import { BillStatus } from '@/types/Bill';
import { useToast } from '@/hooks/use-toast';
import {useEffect, useState} from "react";


const CancelBillPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cancelBill = async () => {
      try {
        setIsLoading(true);
        await billService.updateBillStatus(Number(billId), BillStatus.CANCEL);
        toast({
          title: 'Thành công',
          description: 'Đã hủy đơn hàng thành công',
        });
        setIsLoading(false);
      } catch (error) {
        setError('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        setIsLoading(false);
        toast({
          title: 'Lỗi',
          description: 'Không thể hủy đơn hàng. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    };

    cancelBill();
  }, [billId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Đang xử lý...
              </h1>
              <p className="text-gray-600">
                Vui lòng đợi trong khi chúng tôi hủy đơn hàng của bạn
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500 mb-4">❌</div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Không thể hủy đơn hàng
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button 
                  onClick={() => navigate('/bills')}
                  variant="outline"
                >
                  Quay lại danh sách
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Hủy Đơn Hàng Thành Công
            </h1>
            
            <p className="text-gray-600 mb-6">
              Đơn hàng #{billId} đã được hủy thành công.
              Bạn có thể  tiếp tục mua sắm.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              
              
              <Button 
                onClick={() => navigate('/home')}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelBillPage;
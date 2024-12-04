import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CancelSuccessPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

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
              Bạn có thể tiếp tục mua sắm 
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
             
              
              <Button 
                onClick={() => navigate('/home')}
                className="w-full sm:w-auto"
              >
                Tiếp Tục Mua Sắm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelSuccessPage;
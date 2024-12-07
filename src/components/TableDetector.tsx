import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const TableDetector: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Hàm xử lý và lưu mã bàn
        const parseAndSaveTableId = () => {
            try {
                // Lấy query parameters từ URL
                const searchParams = new URLSearchParams(location.search);
                const qrData = searchParams.get('qrdata');

                if (qrData) {
                    // Decode và parse dữ liệu
                    const decodedData = decodeURIComponent(qrData);
                    const parts = decodedData.split('|');
                    const data: Record<string, string> = {};

                    parts.forEach(part => {
                        const [key, value] = part.split(':');
                        data[key.trim()] = value;
                    });

                    if (data.TABLE_ID) {
                        // Lưu mã bàn vào localStorage
                        localStorage.setItem('tableId', data.TABLE_ID);

                        // Hiển thị thông báo thành công
                        toast({
                            title: "Thành công",
                            description: `Đã lưu thông tin bàn: ${data.TABLE_ID}`,
                        });

                        // Xóa query parameter và chuyển về trang home
                        navigate('/home', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Lỗi khi xử lý mã QR:', error);
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể xử lý thông tin mã QR",
                });
            }
        };

        // Chạy hàm xử lý khi component mount hoặc URL thay đổi
        parseAndSaveTableId();
    }, [location, navigate, toast]);

    // Component không render gì cả
    return null;
};

export default TableDetector;
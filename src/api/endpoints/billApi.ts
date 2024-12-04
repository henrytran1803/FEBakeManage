import { api } from '../axios';
import { ApiResponse } from "@/types/ApiResponse";
import { BillResponseData, BillResponse_View_Cake, BillStatusHistoryDTO, BillRequest, BillStatusDTO, BillStatus, BillResponseCreate } from "@/types/Bill";
import { Search } from 'lucide-react';


// Interface cho các tham số tìm kiếm hóa đơn
interface BillSearchParams {
    status?: string;
    page?: number;
    size?: number;
}
interface SearchParams {
    id?: number;
    customerName?: string;
    customerPhone?: string;
 }

// Định nghĩa API cho các thao tác liên quan đến hóa đơn
export const billApi = {
    // Lấy danh sách hóa đơn theo trạng thái
    search: async (params: BillSearchParams): Promise<ApiResponse<BillResponseData>> => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size) searchParams.append('size', params.size.toString());

        const response = await api.get(`/api/user/bills/status?${searchParams.toString()}`);
        return response.data;
    },

    // Lấy chi tiết hóa đơn theo ID
    getDetailsById: async (billId: number): Promise<ApiResponse<BillResponse_View_Cake>> => {
        const response = await api.get(`/api/user/bills/${billId}`);
        return response.data;
    },

    // Lấy lịch sử trạng thái của hóa đơn
    getStatusHistory: async (billId: number): Promise<ApiResponse<BillStatusHistoryDTO[]>> => {
        const response = await api.get(`/api/user/bills/${billId}/history`);
        return response.data;
    },

    // Tạo hóa đơn mới
    createBill: async (billRequest: BillRequest): Promise<ApiResponse<BillResponseCreate>> => {
        const response = await api.post('/api/user/bills', billRequest);
        return response.data;
    },

    // Cập nhật trạng thái hóa đơn
    updateBillStatus: async (billId: number, newStatus: BillStatus, userId?: number): Promise<ApiResponse<BillStatusDTO>> => {
        const params = new URLSearchParams();
        params.append('newStatus', newStatus);
        if (userId) params.append('userId', userId.toString());

        const response = await api.put(`/api/user/bills/${billId}/status?${params.toString()}`);
        return response.data;
    },
    searchBill: async (params: SearchParams, page = 0, size = 10): Promise<ApiResponse<BillResponseData>> => {
        try {
            // Tạo đối tượng URLSearchParams để xây dựng query động
            const searchParams = new URLSearchParams();
            
            // Thêm các tham số tìm kiếm vào query string một cách linh động
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        
            // Thêm các tham số phân trang
            searchParams.append('page', page.toString());
            searchParams.append('size', size.toString());
        
            // Gọi API với các tham số query động
            const response = await api.get(`/api/user/bills/search?${searchParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi tìm kiếm hóa đơn:', error);
            throw new Error("Không thể tìm kiếm hóa đơn");
        }
    }


};

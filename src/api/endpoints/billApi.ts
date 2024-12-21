import { api } from '../axios';
import { ApiResponse } from "@/types/ApiResponse";
import {
    BillResponseData,
    BillResponse_View_Cake,
    BillRequest,
    BillStatusDTO,
    BillStatus,
    BillResponseCreate,
    BillStatistic
} from "@/types/Bill";


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

export const billApi = {
    search: async (params: BillSearchParams): Promise<ApiResponse<BillResponseData>> => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size) searchParams.append('size', params.size.toString());

        const response = await api.get(`/api/user/bills/status?${searchParams.toString()}`);
        return response.data;
    },
    getTodayBills: async (params: { page?: number; size?: number }): Promise<ApiResponse<BillResponseData>> => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());

        const response = await api.get(`/api/user/bills/todaybill?${searchParams.toString()}`);
        return response.data;
    },
    getDetailsById: async (billId: number): Promise<ApiResponse<BillResponse_View_Cake>> => {
        const response = await api.get(`/api/user/bills/${billId}`);
        return response.data;
    },

 

    // Tạo hóa đơn mới
    createBill: async (billRequest: BillRequest): Promise<ApiResponse<BillResponseCreate>> => {
        const response = await api.post('/api/user/bills', billRequest);
        return response.data;
    },

    // Cập nhật trạng thái hóa đơn
    updateBillStatus: async (billId: number, newStatus: BillStatus): Promise<ApiResponse<BillStatusDTO>> => {
        const params = new URLSearchParams();
        params.append('newStatus', newStatus);
       

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
        
            searchParams.append('page', page.toString());
            searchParams.append('size', size.toString());
            const response = await api.get(`/api/user/bills/search?${searchParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi tìm kiếm hóa đơn:', error);
            throw new Error("Không thể tìm kiếm hóa đơn");
        }
    },
    getTotalToday: async () : Promise<ApiResponse<BillStatistic>> => {
        const response = await api.get('/api/user/bills/today');
        return response.data;
    },
    getTotalMonth: async () : Promise<ApiResponse<BillStatistic>> => {
        const response = await api.get('/api/user/bills/month');
        return response.data;
    },
    getTotalYear: async () : Promise<ApiResponse<BillStatistic>> => {
        const response = await api.get('/api/user/bills/year');
        return response.data;
    },
    getTotalFromdateToDate: async (fromDate: string, toDate: string): Promise<ApiResponse<BillStatistic>> => {
        const response = await api.get('/api/user/bills/custom', {
            params: {
                fromDate,
                toDate
            }
        });
        console.log(response);
        return response.data;
    }
};

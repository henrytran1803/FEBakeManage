
import { billApi } from "@/api/endpoints/billApi";
import { BillRequest, BillStatus, BillStatusDTO } from "@/types/Bill";
import {toast} from "@/hooks/use-toast.ts";



interface SearchParams {
    id?: number;
    customerName?: string;
    customerPhone?: string;
}

export const billService = {
    search: async (status: string, page: number = 0, size: number = 10) => {
        try {
            const response = await billApi.search({ status, page, size });
            return response;  // Trả về kết quả từ API
        } catch (error) {
            throw new Error("Failed to search bills");
        }
    },
    getTodayBills: async (page: number = 0, size: number = 10) => {
        try {
            const response = await billApi.getTodayBills({ page, size });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch today's bills");
        }
    },
    searchBill: async (params: SearchParams) => {
        try {
            // Gọi API với các tham số được truyền vào
            const response = await billApi.searchBill({ ...params  });
            return response;
        } catch (error) {
            console.error("Tìm kiếm hóa đơn thất bại", error);
            throw new Error("Không thể tìm kiếm hóa đơn");
        }
    
    },

    // API lấy chi tiết hóa đơn theo ID
    getDetailsById: async (billId: number) => {
        try {
            const response = await billApi.getDetailsById(billId);
            return response.data;  // Trả về chi tiết hóa đơn
        } catch (error) {
            throw new Error(`Failed to fetch bill details for bill ID ${billId}`);
        }
    },



    // API tạo hóa đơn mới
    createBill: async (billRequest: BillRequest) => {
        try {
            const response = await billApi.createBill(billRequest);
            return response.data;  // Trả về kết quả từ API
        } catch (error) {
            throw new Error("Failed to create a new bill");
        }
    },

    // API cập nhật trạng thái hóa đơn
    updateBillStatus: async (billId: number, newStatus: BillStatus): Promise<BillStatusDTO> => {
        try {
            const response = await billApi.updateBillStatus(billId, newStatus);
            return response.data;  // Trả về kết quả từ API
        } catch (error) {
            throw new Error(`Failed to update bill status for bill ID ${billId}`);
        }
    },

    getTotalToday: async () => {
        try{
            const response = await billApi.getTotalToday();
            return response;
        }catch(error){
            throw new Error("Failed to get total total");
        }
    },
    getTotalMonth: async () => {
        try{
            const response = await billApi.getTotalMonth();
            return response;
        }catch(error){
            throw new Error("Failed to get total total");
        }
    },
    getTotalYear: async () => {
        try{
            const response = await billApi.getTotalYear();
            return response;
        }catch(error){
            throw new Error("Failed to get total total");
        }
    },
    getFromDateToDate: async (fromDate: string, toDate:string) => {
        try{
            const response = await billApi.getTotalFromdateToDate(fromDate, toDate);
            return response;
        }catch(error){
            throw new Error("Failed to get total total");
        }
    },
};

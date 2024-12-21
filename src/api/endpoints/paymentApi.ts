import { CheckoutResponseData } from '@/types/payment';
import { api } from '../axios';
import { ApiResponse } from "@/types/ApiResponse";

export const paymentApi ={
     // API lấy tất cả khu vực
     getCreatePayment: async (id: number): Promise<ApiResponse<CheckoutResponseData>> => {
        try {
          const response = await api.get(`/api/payment/bill/${id}`);
            return response.data;
        } catch (error) {
          throw new Error("Failed to create payment"); // Cũng nên sửa lại message error cho phù hợp
        }
      },

}

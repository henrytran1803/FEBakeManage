// src/api/endpoints/billApi.ts
import { api } from '../axios'; 
import { ApiResponse } from '@/types/ApiResponse';
import { BillResponseData } from '@/types/Bill'; // Chỉ import BillResponseData

interface BillSearchParams {
  status?: string;
  page?: number;
  size?: number;
}

export const billApi = {
  search: async (params: BillSearchParams): Promise<ApiResponse<BillResponseData>> => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size) searchParams.append('size', params.size.toString());

    const response = await api.get(`/api/admin/bills/status?${searchParams.toString()}`);
    return response.data;
  },
};

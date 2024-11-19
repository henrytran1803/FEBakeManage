import {ApiResponse} from "@/types/ApiResponse.ts";
import {GetBatchByStatus, ProductBatch, QuickDisposed} from "@/types/productBatch.ts";
import {api} from "@/api/axios.ts";

export const productBatchAPI = {
    getAll: async (): Promise<ApiResponse<ProductBatch[]>> => {
        const response = await api.get(`/api/products/productbatches`);
        return response.data;
    },

    quickDissposed: async (data: QuickDisposed): Promise<ApiResponse<string>> => {
        const response = await api.post(`/api/products/productbatches`, data);
        return response.data;
    }

    ,
    getAllByStatuses: async (statuses: string[]): Promise<ApiResponse<GetBatchByStatus[]>> => {
        const query = statuses.map(status => `statuses=${encodeURIComponent(status)}`).join('&');
        const response = await api.get(`/api/products/productbatches/statuses?${query}`);
        console.log(`/api/products/productbatches?${query}`)
        return response.data;

    },
    // getAllByStatuses: async (statuses: string[]): Promise<ApiResponse<ProductBatch[]>> => {
    //     const query = statuses.map(status => `statuses=${encodeURIComponent(status)}`).join('&');
    //     const response = await api.get(`/api/products/productbatches/statuses?${query}`);
    //     return response.data;
    // },

}
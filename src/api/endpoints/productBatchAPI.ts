import {ApiResponse} from "@/types/ApiResponse.ts";
import {ProductBatch} from "@/types/productBatch.ts";
import {api} from "@/api/axios.ts";

export const productBatchAPI = {
    getAll: async (): Promise<ApiResponse<ProductBatch[]>> => {
        const response = await api.get(`/api/products/productbatches`);
        return response.data;
    }
}
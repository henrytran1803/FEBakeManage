
import {api} from "@/api/axios.ts";
import {DisposedProductDetailResponseDTO, DisposedProductSummaryDTO} from "@/types/disposed.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";

export const disposedApi = {
    getAll: async (): Promise<ApiResponse<DisposedProductSummaryDTO[]>> => {
        const response = await api.get(`/api/disposed`);
        console.log(response);
        return response.data;

    },
    getById: async (id:number): Promise<ApiResponse<DisposedProductDetailResponseDTO>> => {
        const response = await api.get(`/api/disposed/${id}`);
        return response.data;
    }

}

import {api} from "@/api/axios.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";
import {Price} from "@/types/price.ts";

export const priceApi = {
    getById: async (id: number): Promise<ApiResponse<Price[]>> => {
        const response = await api.get(`/api/price/${id}/history`);
        return response.data;
    },
}
import {
    PaginatedPromotionResponse, Promotion,
    PromotionCreate, PromotionDaily, PromotionDetail, PromotionDetailCreate, PromotionForDetail,
    PromotionSearchParams,
    PromotionUpdate
} from "@/types/promotion.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";

export const promotionApi = {
    search: async (params: PromotionSearchParams): Promise<ApiResponse<PaginatedPromotionResponse>> => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size) searchParams.append('size', params.size.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortDir) searchParams.append('sortDir', params.sortDir);
        if (params.id !== undefined) searchParams.append('id', params.id.toString());
        if (params.name) searchParams.append('name', params.name);
        if (params.description) searchParams.append('description', params.description);
        if (params.discount !== undefined) searchParams.append('discount', params.discount.toString());
        if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        const response = await api.get(`/api/promotions/search?${searchParams.toString()}`);
        return response.data;
    },
    create: async (data: PromotionCreate): Promise<ApiResponse<PromotionCreate>> => {
        const response = await api.post(`/api/promotions`, data);
        return response.data;
    },
    update: async (id: number,data: PromotionUpdate): Promise<ApiResponse<Promotion>> => {
            const response = await api.put(`/api/promotions/${id}`, data);
            return response.data;
    },
    createPromotionDetail: async (data: PromotionDetailCreate, id: number): Promise<ApiResponse<PromotionDetail>> => {
        const response = await api.post(`/api/promotions/${id}/products`, data);
        return response.data;
    },
    getById: async (id: number): Promise<ApiResponse<PromotionForDetail>> => {
        const response = await api.get(`/api/promotions/${id}`);
        return response.data;
    },
    deletePromotionDetail: async (promotionId: number, productId: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/promotions/${promotionId}/products/${productId}`);
        return response.data;
    },
    updateStatus: async (promotionId: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/promotions/${promotionId}`);
        return response.data;
    },
    createDailyPromotion: async (data: PromotionDaily): Promise<ApiResponse<void>> => {
        console.log(data)
        const response = await api.post(`/api/discounts`, data);
        return response.data;
    },
};
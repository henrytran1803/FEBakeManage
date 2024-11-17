// api/endpoints/categoryApi.ts
import { api } from '../axios';
import {ApiResponse} from "@/types/ApiResponse.ts";
import {Category, CategoryCreate, PaginatedCategoryResponse} from "@/types/Category.ts";

interface SearchParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
    isActive?: boolean;
}

export const categoryApi = {
    search: async (params: SearchParams): Promise<ApiResponse<PaginatedCategoryResponse>> => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size) searchParams.append('size', params.size.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortDir) searchParams.append('sortDir', params.sortDir);
        if (params.name) searchParams.append('name', params.name);
        if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

        const response = await api.get(`/api/categories/search?${searchParams.toString()}`);
        return response.data;
    },
    getById: async (id: number): Promise<ApiResponse<Category>> => {
        const response = await api.get(`/api/categories/${id}`);
        return response.data;
    },
    create: async (data: Partial<CategoryCreate>): Promise<ApiResponse<CategoryCreate>> => {
        const response = await api.post('/api/categories', data);
        return response.data;
    },
    update: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
        const response = await api.put(`/api/categories`, data);
        return response.data;
    },
    delete: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/categories/${id}`);
        return response.data;
    },
    getAll: async (): Promise<ApiResponse<Category[]>> => {
        const response = await api.get(`/api/categories`);
        return response.data;
    }
};

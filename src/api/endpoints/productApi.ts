import {
    PaginatedProductResponse, Product,
    ProductCreate,
    ProductDetail, ProductUpdate,
    SearchProductParams,
} from "@/types/product.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";

export const productApi = {
    search: async (params: SearchProductParams): Promise<ApiResponse<PaginatedProductResponse>> => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size) searchParams.append('size', params.size.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortDir) searchParams.append('sortDir', params.sortDir);
        if (params.name) searchParams.append('name', params.name);
        if (params.status !== undefined) searchParams.append('status', params.status.toString());
        if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
        if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());

        const response = await api.get(`/api/products/search?${searchParams.toString()}`);
        return response.data;
    },

    getDetail: async (id: number): Promise<ApiResponse<ProductDetail>> => {
        const response = await api.get(`/api/products/${id}/detail`);
        return response.data;
    },

    create: async (data: ProductCreate): Promise<ApiResponse<ProductCreate>> => {
        const response = await api.post('/api/products', data);
        return response.data;
    },

    update: async (data: ProductUpdate): Promise<ApiResponse<ProductUpdate>> => {
        const response = await api.put(`/api/products`, data);
        return response.data;
    },
    getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
        const response = await api.get(`/api/products`);
        return response.data;
    },
    updateStatus: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/products/${id}`);
        return response.data;
    }
};
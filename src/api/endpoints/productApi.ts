import {
    PaginatedProductActiveResponse,
    PaginatedProductResponse, Product, ProductCart, ProductCartRequest,
    ProductCreate,
    ProductDetail, ProductDetailActive, ProductUpdate, SearchProductActiveParams,
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
    searchActive: async (
        params?: SearchProductActiveParams
    ): Promise<ApiResponse<PaginatedProductActiveResponse>> => {
        const searchParams = new URLSearchParams();

        // Add pagination and sorting params
        if (params?.page !== undefined) searchParams.append('page', params.page.toString());
        if (params?.size !== undefined) searchParams.append('size', params.size.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);

        // Add search params
        if (params?.productName) searchParams.append('productName', params.productName);

        // Handle array of category IDs
        if (params?.categoryIds && params.categoryIds.length > 0) {
            params.categoryIds.forEach(id => {
                searchParams.append('categoryIds', id.toString());
            });
        }

        console.log(`/api/products/search/active?${searchParams.toString()}`)
        const response = await api.get<ApiResponse<PaginatedProductActiveResponse>>(
            `/api/products/search/active?${searchParams.toString()}`
        );
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
    },
    getProductActive: async (id: number): Promise<ApiResponse<ProductDetailActive>> => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },


    getProductCart: async (data: ProductCartRequest): Promise<ApiResponse<ProductCart[]>> => {
        const response = await api.post(`/api/products/cart`,data);
        return response.data;
    },
};
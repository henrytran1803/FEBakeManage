import {ApiResponse} from "@/types/ApiResponse.ts";
import {CreateImageResponse, UploadResponse} from "@/types/upload.ts";
import {api} from "@/api/axios.ts";

export const uploadApi = {
    uploadImage: async (formData: FormData): Promise<ApiResponse<UploadResponse>> => {
        const response = await api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteImageByName: async (fileName: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/upload?fileName=${fileName}`);
        return response.data;
    },

    deleteImageById: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/images/${id}`);
        return response.data;
    },

    createImage: async (data: {
        productId: number;
        url: string;
    }): Promise<ApiResponse<CreateImageResponse>> => {
        const response = await api.post('/api/images', data);
        return response.data;
    },
};
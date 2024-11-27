// src/api/endpoints/ingredientApi.ts
import { api } from "@/api/axios";  // Giả sử bạn có một file axios.ts cho API base
import { ApiResponse } from "@/types/ApiResponse";
import { ExportIngredientsRequest } from "@/types/ExportIngredientsRequest";
import { ImportIngredientsRequest } from "@/types/ImportIngredientsRequest";
import { Ingredient } from "@/types/Ingredient";

export const ingredientApi = {
    //Danh sách nguyên liệu
    getAllIngredients: async (): Promise<ApiResponse<Ingredient[]>> => {
        const response = await api.get("/api/ingredients");
        return response.data;
    },
    //Thêm nguyên liệu mới
    createIngredient: async (data: { name: string; unit_id: number; warning_limits: number }): Promise<ApiResponse<Ingredient>> => {
        const response = await api.post("/api/ingredients", data);
        return response.data;
    },
    //Sửa nguyên liệu
    updateIngredient: async (id: number, data: { name: string; unit_id: number; warning_limits: number }): Promise<ApiResponse<Ingredient>> => {
        const response = await api.put(`/api/ingredients/${id}`, data);
        return response.data;
    },
    //Xóa nguyên liệu
    deleteIngredient: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/ingredients/${id}`);
        return response.data;
    },

    //nhập nguyên liệu 
    importIngredients: async (data: ImportIngredientsRequest): Promise<ApiResponse<any>> => {
        const response = await api.post("/api/ingredients/import", data);
        return response.data;
    },

    //Xuất nguyên liệu 
    exportIngredients: async (data: ExportIngredientsRequest): Promise<ApiResponse<any>> => {
        const response = await api.post("/api/ingredients/export", data);
        return response.data;
    },

    //Lấy danh sách nhập nguyên liệu 
    getImportIngredients: async (): Promise<ApiResponse<any>> => {
        const response = await api.get("/api/ingredients/import");
        return response.data;
    },

    // API lấy danh sách xuất nguyên liệu (GET /api/ingredients/export)
    getExportIngredients: async (): Promise<ApiResponse<any>> => {
        const response = await api.get("/api/ingredients/export");
        return response.data;
    },

    //Tìm kiếm nguyên liệu 
    searchIngredients: async (keyword: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/api/ingredients/search?keyword=${keyword}`);
        return response.data;
    }


};

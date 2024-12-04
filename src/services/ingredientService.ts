// src/services/ingredientService.ts
import { ingredientApi } from "@/api/endpoints/ingredientApi";
import { Ingredient } from "@/types/Ingredient.ts";
import { ApiResponse } from "@/types/ApiResponse";
import { ImportIngredientsRequest } from "@/types/ImportIngredientsRequest";
import { ExportIngredientsRequest } from "@/types/ExportIngredientsRequest";
import {ingredientApi} from "@/api/endpoints/ingredientApi.ts";

export const ingredientService = {
    getAllIngredients: async (): Promise<ApiResponse<Ingredient[]>> => {
        try {
            const response = await ingredientApi.getAllIngredients();
            return response;
        } catch (error) {
            throw new Error("Failed to fetch ingredients");
        }
    },
   getAll: async () => {
          try {
              const response = await ingredientApi.getAll();
              return response.data;
          }
          catch (error) {
              throw new Error("cannot get all Ingredient API");
          }
      },
    createIngredient: async (data: { name: string; unit_id: number; warning_limits: number }): Promise<ApiResponse<Ingredient>> => {
        try {
            const response = await ingredientApi.createIngredient(data);
            return response;
        } catch (error) {
            throw new Error("Failed to create ingredient");
        }
    },

    updateIngredient: async (id: number, data: { name: string; unit_id: number; warning_limits: number }): Promise<ApiResponse<Ingredient>> => {
        try {
            const response = await ingredientApi.updateIngredient(id, data);
            return response;
        } catch (error) {
            throw new Error("Failed to update ingredient");
        }
    },

    deleteIngredient: async (id: number): Promise<ApiResponse<void>> => {
        try {
            const response = await ingredientApi.deleteIngredient(id);
            return response;
        } catch (error) {
            throw new Error("Failed to delete ingredient");
        }
    },

    // Nhập nguyên liệu
    importIngredients: async (data: ImportIngredientsRequest): Promise<ApiResponse<any>> => {
        try {
            const response = await ingredientApi.importIngredients(data);
            return response;
        } catch (error) {
            throw new Error("Failed to import ingredients");
        }
    },

    // Xuất nguyên liệu
    exportIngredients: async (data: ExportIngredientsRequest): Promise<ApiResponse<any>> => {
        try {
            const response = await ingredientApi.exportIngredients(data);
            return response;
        } catch (error) {
            throw new Error("Failed to export ingredients");
        }
    },

    // Lấy danh sách nhập nguyên liệu
    getImportIngredients: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await ingredientApi.getImportIngredients();
            return response;
        } catch (error) {
            throw new Error("Failed to fetch import ingredients");
        }
    },

    // Lấy danh sách xuất nguyên liệu
    getExportIngredients: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await ingredientApi.getExportIngredients();
            return response;
        } catch (error) {
            throw new Error("Failed to fetch export ingredients");
        }
    },

    // Tìm kiếm nguyên liệu
    searchIngredients: async (keyword: string): Promise<ApiResponse<any>> => {
        try {
            const response = await ingredientApi.searchIngredients(keyword);
            return response;
        } catch (error) {
            throw new Error("Failed to search ingredients");
        }
    }
};


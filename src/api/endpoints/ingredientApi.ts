import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";
import {Ingredient} from "@/types/ingredient.ts";

export const ingredientApi = {
    getAll: async (): Promise<ApiResponse<Ingredient[]>> => {
        const response = await api.get(`/api/ingredients/active`);
        return response.data;
    },
}
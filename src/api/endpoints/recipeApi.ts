import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";
import {Recipe, RecipeResponse} from "@/types/recipe.ts";
import {CreateRecipe, GetRecipe, Recipe} from "@/types/recipe.ts";

export const recipeApi = {
    getAllRecipes: async(): Promise<ApiResponse<Recipe[]>> => {
        const response = await api.get(`/api/recipes`);
        return response.data;
    },

    getRecipesByProduct: async (productId: number): Promise<ApiResponse<RecipeResponse>> => {
        const response = await api.get(`/api/recipes/findByProduct/${productId}`);
        return response.data;
    }
    createRecipe: async (data: CreateRecipe): Promise<ApiResponse<Recipe>> => {
        const response = await api.post(`/api/recipes`, data);
        return response.data;
    },

    getRecipeById: async (id: number): Promise<ApiResponse<GetRecipe>> => {
        const response = await api.get(`/api/recipes/${id}`);
        return response.data;
    },
    deleteRecipe: async (id: number): Promise<ApiResponse<string>> => {
        const response = await api.delete(`/api/recipes/${id}`);
        return response.data;
    }

}
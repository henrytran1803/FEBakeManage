import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";
import {Recipe, RecipeResponse} from "@/types/recipe.ts";

export const recipeApi = {
    getAllRecipes: async(): Promise<ApiResponse<Recipe[]>> => {
        const response = await api.get(`/api/recipes`);
        return response.data;
    },

    getRecipesByProduct: async (productId: number): Promise<ApiResponse<RecipeResponse>> => {
        const response = await api.get(`/api/recipes/findByProduct/${productId}`);
        return response.data;
    }
}
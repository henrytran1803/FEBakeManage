import {ApiResponse} from "@/types/ApiResponse.ts";
import {api} from "@/api/axios.ts";
import {Recipe} from "@/types/recipe.ts";

export const recipeApi = {
    getAllRecipes: async(): Promise<ApiResponse<Recipe[]>> => {
    const response = await api.get(`/api/recipes`);
    return response.data;
}
}
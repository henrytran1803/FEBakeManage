import {recipeApi} from "@/api/endpoints/recipeApi.ts";

export const recipeService = {
    getAllRecipes : async () => {
        try {
            const response  = await recipeApi.getAllRecipes();
            return response
        }catch (error) {
            throw new Error("cannot get all recipes");
        }
    },
    getRecipesByProduct: async (productId: number) => {
        try {
            const response = await recipeApi.getRecipesByProduct(productId);
            if (!response.success) {
                console.error("API trả về lỗi:", response.message);
                throw new Error(response.message || "Lỗi API");
            }
            return response;
        } catch (error) {
            throw new Error("Failed to get recipes");
        }
    }
}
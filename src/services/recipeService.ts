import {recipeApi} from "@/api/endpoints/recipeApi.ts";
import {CreateRecipe} from "@/types/recipe.ts";

export const recipeService = {
    getAllRecipes : async () => {
        try {
            const response  = await recipeApi.getAllRecipes();
            return response
        }catch (error) {
            throw new Error("cannot get all recipes");
        }
    },
    getRecipeByid : async (id :number) => {
        try {
            const response  = await recipeApi.getRecipeById(id);
            return response
        }catch (error) {
            throw new Error("cannot get all recipes");
        }
    },
    createRecipe : async (recipe: CreateRecipe) => {
        try {
            const response = await recipeApi.createRecipe(recipe);
            return response;
        }
        catch (error) {
            throw new Error("Failed to create recipes");
        }
    },
    deleteRecipe : async (id: number) => {
        try {
            const response = await recipeApi.deleteRecipe(id);
            return response;
        }
        catch (error) {
            throw new Error("Failed to delete recipes");
        }
    }
}
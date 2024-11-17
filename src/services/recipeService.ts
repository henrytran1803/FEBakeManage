import {recipeApi} from "@/api/endpoints/recipeApi.ts";

export const recipeService = {
getAllRecipes : async () => {
    try {
        const response  = await recipeApi.getAllRecipes();
        return response
    }catch (error) {
        throw new Error("cannot get all recipes");
    }
}
}
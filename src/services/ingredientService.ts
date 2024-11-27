import {ingredientApi} from "@/api/endpoints/ingredientApi.ts";


export const ingredientService = {
    getAll: async () => {
        try {
            const response = await ingredientApi.getAll();
            return response.data;
        }
        catch (error) {
            throw new Error("cannot get all Ingredient API");
        }
    }
}
import {dashboardApi} from "@/api/endpoints/dashboardApi.ts";

export const dashBoardService = {
    getAllRecipes: async () => {
        try {
            const response = await dashboardApi.getDashBoard();
            return response
        } catch (error) {
            throw new Error("cannot get all recipes");
        }
    }
}
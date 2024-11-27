import { api } from "@/api/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Unit } from "@/types/Unit";

export const unitService = {
    getAllUnits: async (): Promise<ApiResponse<Unit[]>> => {
        const response = await api.get("/api/units");
        return response.data;
    },
    createUnit: async (name: string): Promise<ApiResponse<Unit>> => {
        try {
            const response = await api.post("/api/units", { name });
            return response.data;
        } catch (error) {
            console.error("Error creating unit:", error);
            throw error;
        }
    },
};

import {disposedApi} from "@/api/endpoints/disposedApi.ts";

export const disposedService = {
    getAll: async () => {
        try {
            const response = await disposedApi.getAll();
            return response
        } catch (error) {
            throw new Error("cannot get all recipes");
        }
    },
    getById: async (id: number) => {
        try {
            const response = await disposedApi.getById(id);
            return response
        } catch (error) {
            throw new Error("cannot get all recipes");
        }
    }
}
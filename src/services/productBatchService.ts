import {productBatchAPI} from "@/api/endpoints/productBatchAPI.ts";

export const productBatchService = {
    getAllProductBatches: async () => {
        try {
            const response = await productBatchAPI.getAll();
            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    }
}
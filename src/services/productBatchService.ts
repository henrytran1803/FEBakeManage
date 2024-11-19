import {productBatchAPI} from "@/api/endpoints/productBatchAPI.ts";
import {QuickDisposed} from "@/types/productBatch.ts";

export const productBatchService = {
    getAllProductBatches: async () => {
        try {
            const response = await productBatchAPI.getAll();
            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    },
    quickDisposed: async (quickDisposed: QuickDisposed ) => {

        try{
            const response = await productBatchAPI.quickDissposed(quickDisposed);
            return response;
        }catch (error) {
            throw new Error('Failed to disposed product');
        }
    },

    getAllProductBatchByStatuses: async (statues: string[]) => {
        try {
            const response = await productBatchAPI.getAllByStatuses(statues);
            console.log(response)
            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    },
}
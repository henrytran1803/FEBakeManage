
import {promotionApi} from "@/api/endpoints/promotionApi.ts";
import {
    PromotionCreate, PromotionDaily,
    PromotionDetailCreate,
    PromotionSearchParams,
    PromotionUpdate
} from "@/types/promotion.ts";

export const promotionService = {
    searchPromotions: async (params: {
        page: number;
        size: number;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        name?: string;
        isActive?: boolean;
    }) => {
        try {
            const apiParams:PromotionSearchParams  = {
                page: params.page,
                size: params.size,
                sortBy: params.sortBy || 'name',
                sortDir: params.sortDir || 'asc',
                name: params.name || undefined,
                isActive: params.isActive !== undefined ? params.isActive : undefined
            };

            const response = await promotionApi.search(apiParams);
            return response;

        } catch (error) {
            throw new Error('Failed to fetch products');
        }
    },

    createPromotion: async (data: PromotionCreate) => {
        console.log(data)

        try {
            const response = await promotionApi.create(data);

            return response;
        } catch (error) {
            throw new Error('Failed to create promotion');
        }
    },
    createPromotionDaily: async (data: PromotionDaily) => {
        try {
            data.endDate = `${data.endDate}T00:00:00`;
            const response = await promotionApi.createDailyPromotion(data);
            console.log(data)
            return response;
        } catch (error) {
            throw new Error('Failed to create promotion');
        }
    },
    updatePromotion: async (
        promotionId: number,
        updateData: PromotionUpdate,
        newProductIds: number[],
        removedProductIds: number[]
    ) => {
        try {

            if (newProductIds) {
                for (const product of newProductIds) {
                    const promotionDetailCreate: PromotionDetailCreate =  {
                        productBatchId: product
                    }
                    promotionApi.createPromotionDetail(promotionDetailCreate, promotionId)
                }
            }
            if (removedProductIds) {
                for (const product of removedProductIds) {
                    promotionApi.deletePromotionDetail(promotionId, product)
                }
            }
            const response =  await promotionApi.update(promotionId,updateData);

            return response;

        } catch (error) {
            throw new Error('Failed to update promotion');
        }
    },


    deletePromotion: async (promotionId: number) => {
        try {
            const response = await promotionApi.updateStatus(promotionId);
            return response;
        } catch (error) {
            throw new Error('Failed to delete promotion');
        }
    },
    getPromotionDetail: async (id: number) => {
        try {
            const response = await promotionApi.getById(id);
            return response;
        } catch (error) {
            throw new Error('Failed to delete promotion');
        }
    }
}

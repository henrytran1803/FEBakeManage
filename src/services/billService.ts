import { billApi } from '@/api/endpoints/billApi'; 

export const billService = {
    searchBills: async (params: {
        status: string;
        page: number;
        size: number;
    }) => {
        try {
            const apiParams = {
                status: params.status,
                page: params.page,
                size: params.size
            };

            const response = await billApi.search(apiParams);
            console.log(response);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch bills');
        }
    }
};


import {api} from "@/api/axios.ts";
import {DashBoardDTO} from "@/types/dashboard.ts";

export const dashboardApi = {
    getDashBoard: async (): Promise<DashBoardDTO> => {
        const response = await api.get(`/api/dashboard`);
        return response.data;
    },
}
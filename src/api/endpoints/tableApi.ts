// api/endpoints/tableApi.ts
import { api } from '../axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Table, TableRequest } from '@/types/table';

export const tableApi = {
  create: async (tableRequest: TableRequest): Promise<ApiResponse<Table>> => {
    try {
      const response = await api.post('/api/admin/tables', tableRequest);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create table");
    }
  },

  update: async (id: number, tableRequest: TableRequest): Promise<ApiResponse<Table>> => {
    try {
      const response = await api.put(`/api/admin/tables/${id}`, tableRequest);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update table");
    }
  },

  getTablesByAreaId: async (areaId: number): Promise<ApiResponse<Table[]>> => {
    try {
      const response = await api.get(`/api/admin/tables/by-area`, {
        params: { areaId }
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch tables by area");
    }
  }
};
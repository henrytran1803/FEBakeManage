// areaApi.ts

import { api } from '../axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Area } from '@/types/Area';

export const areaApi = {
  // API lấy tất cả khu vực
  getAllAreas: async (): Promise<ApiResponse<Area[]>> => {
    try {
      const response = await api.get('/api/admin/areas');
      return response.data;  // Trả về kết quả API
    } catch (error) {
      throw new Error("Failed to fetch areas");
    }
  },

  // API lấy khu vực theo id
  getAreaById: async (id: number): Promise<ApiResponse<Area>> => {
    try {
      const response = await api.get(`/api/admin/areas/${id}`);
      return response.data;  // Trả về kết quả API
    } catch (error) {
      throw new Error("Failed to fetch area by ID");
    }
  },

  // API tạo khu vực mới
  create: async (area: Area): Promise<ApiResponse<Area>> => {
    try {
      const response = await api.post('/api/admin/areas', area);
      return response.data;  // Trả về kết quả API
    } catch (error) {
      throw new Error("Failed to create area");
    }
  },

  // API xóa khu vực
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/api/admin/areas/${id}`);
      return response.data;  // Trả về kết quả API
    } catch (error) {
      throw new Error("Failed to delete area");
    }
  },
  // API xóa khu vực
  update: async (id: number,area: Area): Promise<ApiResponse<Area>> => {
    try {
      const response = await api.put(`/api/admin/areas/${id}`,area);
      return response.data;  // Trả về kết quả API
    } catch (error) {
      throw new Error("Failed to update area");
    }
  }
}

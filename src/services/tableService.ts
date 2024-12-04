import { tableApi } from "@/api/endpoints/tableApi";
import { Table, TableRequest } from "@/types/table";
import { ApiResponse } from "@/types/ApiResponse";

export const tableService = {
  // Tạo bàn mới
  createTable: async (tableRequest: TableRequest) => {
    try {
      const response = await tableApi.create(tableRequest);
      return response;
    } catch (error) {
      console.error("Tạo bàn thất bại", error);
      throw new Error("Không thể tạo bàn mới");
    }
  },

  // Cập nhật bàn
  updateTable: async (id: number, tableRequest: TableRequest) => {
    try {
      const response = await tableApi.update(id, tableRequest);
      return response;
    } catch (error) {
      console.error("Cập nhật bàn thất bại", error);
      throw new Error("Không thể cập nhật bàn");
    }
  },

  // Lấy danh sách bàn theo khu vực
  getTablesByArea: async (areaId: number): Promise<ApiResponse<Table[]>> => {
    try {
      const response = await tableApi.getTablesByAreaId(areaId);
      return response;
    } catch (error) {
      console.error(`Không thể lấy danh sách bàn của khu vực ${areaId}`, error);
      throw new Error("Không thể lấy danh sách bàn");
    }
  }
};
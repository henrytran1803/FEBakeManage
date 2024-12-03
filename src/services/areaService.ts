import { areaApi } from "@/api/endpoints/areaApi";
import { Area } from "@/types/Area";

// Khai báo service cho khu vực (Area)
export const areaService = {
  // API lấy tất cả khu vực
  getAllAreas: async () => {
    try {
      const response = await areaApi.getAllAreas();
      return response;  // Trả về kết quả từ API
    } catch (error) {
      console.error("Tìm kiếm khu vực thất bại", error);
      throw new Error("Không thể lấy danh sách khu vực");
    }
  },

  // API lấy khu vực theo ID
  getAreaById: async (id: number) => {
    try {
      const response = await areaApi.getAreaById(id);
      return response.data;  // Trả về khu vực theo ID
    } catch (error) {
      console.error(`Không thể lấy khu vực với ID ${id}`, error);
      throw new Error("Không thể lấy khu vực");
    }
  },

  // API tạo mới khu vực
  createArea: async (area: Area) => {
    try {
      const response = await areaApi.create(area);
      return response;  // Trả về kết quả sau khi tạo khu vực
    } catch (error) {
      console.error("Tạo khu vực thất bại", error);
      throw new Error("Không thể tạo khu vực mới");
    }
  },
  //update
  updateArea: async (id: number,area: Area) => {
    try {
      const response = await areaApi.update(id,area);
      return response.data;  // Trả về kết quả sau khi tạo khu vực
    } catch (error) {
      console.error("Cập nhật khu vực thất bại", error);
      throw new Error("Không thể cập nhật khu vực");
    }
  },

  // API xóa khu vực p-4 min-w-[82vw]
  deleteArea: async (id: number) => {
    try {
      const response = await areaApi.delete(id);
      return response.data;  // Trả về kết quả sau khi xóa khu vực
    } catch (error) {
      console.error(`Không thể xóa khu vực với ID ${id}`, error);
      throw new Error("Không thể xóa khu vực");
    }
  }
};

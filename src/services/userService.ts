import {userApi, UserSearchParams} from "@/api/endpoints/userApi";
import { UserRequest } from "@/types/User";



export const userService = {
    createUser: async(register: RegisterRequest)=>{
        try {
            const response = await userApi.createUser(register);  // Gọi API để tạo người dùng
            return response.data;  // Trả về dữ liệu khi tạo thành công
          } catch (error) {
            // Xử lý lỗi (ví dụ: lỗi 403 hoặc lỗi khác)
            console.error("Error creating user:", error);
            throw new Error('Failed to create user');  // Hoặc trả về thông báo lỗi cho UI
          }
    },
    updateUser: async (id: number, userRequest: UserRequest) => {

        try {
            const response = await userApi.updateUser(id, userRequest);
            return response;
        } catch (error) {
            throw new Error("Failed to update user");
        }
    },

    deactivateUser: async (id: number) => {
        try {
            const response = await userApi.deactivateUser(id);
            return response;
        } catch (error) {
            throw new Error("Failed to deactivate user");
        }
    },

       activateUser: async (id: number) => {
        try {
            const response = await userApi.activateUser(id);
            return response;
        } catch (error) {
            throw new Error("Failed to deactivate user");
        }
    },

    getActiveUsers: async (params: UserSearchParams = {}) => {
        try {
            const response = await userApi.getActiveUsers({
                page: params.page ?? 0,
                size: params.size ?? 10,
                isActive: params.isActive
            });
            console.log(response);
            return response;
        } catch (error) {
            throw new Error("Failed to fetch active users");
        }
    },

    getUserById: async (id: number) => {
        try {
            const response = await userApi.getUserById(id);
            return response;
        } catch (error) {
            throw new Error("Failed to fetch user by ID");
        }
    },

    // API lấy danh sách tất cả user(tên)
    getAllUser: async () => {
        try {
            const response = await userApi.getAllUser();
            return response;
        } catch (error) {
            throw new Error("Fail to get all user");
        }
    },
};

export { userApi };

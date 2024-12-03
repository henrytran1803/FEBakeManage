import { userApi } from "@/api/endpoints/userApi";
import { RegisterRequest, UserRequest } from "@/types/User";


// Khai báo service cho user
export const userService = {
    createUser: async(register: RegisterRequest)=>{
        const response=await userApi.create(register);
        return response.data;
    },
    // API sửa thông tin người dùng
    updateUser: async (id: number, userRequest: UserRequest) => {
        try {
            const response = await userApi.updateUser(id, userRequest);
            return response;  // Trả về kết quả từ API
        } catch (error) {
            throw new Error("Failed to update user");  // Xử lý lỗi nếu có
        }
    },

    // API khóa tài khoản người dùng
    deactivateUser: async (id: number) => {
        try {
            const response = await userApi.deactivateUser(id);
            return response;
        } catch (error) {
            throw new Error("Failed to deactivate user");
        }
    },

    // API lấy danh sách người dùng active với phân trang
    getActiveUsers: async (page: number = 0, size: number = 10) => {
        try {
            const response = await userApi.getActiveUsers({ page, size });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch active users");
        }
    },

    // API lấy danh sách người dùng inactive với phân trang
    getInactiveUsers: async (page: number = 0, size: number = 10) => {
        try {
            const response = await userApi.getInactiveUsers({ page, size });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch inactive users");
        }
    },

    // API lấy thông tin người dùng theo ID
    getUserById: async (id: number) => {
        try {
            const response = await userApi.getUserById(id);
            return response;
        } catch (error) {
            throw new Error("Failed to fetch user by ID");
        }
    },
};

export { userApi };

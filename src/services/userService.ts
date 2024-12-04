import { userApi } from "@/api/endpoints/userApi";
import { RegisterRequest, UserRequest, UserRequestSua } from "@/types/User";


// Khai báo service cho user
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
    // API sửa thông tin người dùng
    updateUser: async (id: number, userRequest: UserRequestSua) => {
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

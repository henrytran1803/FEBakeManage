import {userApi, UserSearchParams} from "@/api/endpoints/userApi";
import {UserRequest} from "@/types/User.ts";



export const userService = {
    createUser: async(userRequest: UserRequest)=>{
        try {
            const response = await userApi.create(userRequest);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error('Failed to create user');
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
    getActive: async (params: UserSearchParams = {}) => {
        try {
            const response = await userApi.getActive({
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
    getInActive: async (params: UserSearchParams = {}) => {
        try {
            const response = await userApi.getInActive({
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
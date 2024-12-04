import {userApi, UserSearchParams} from "@/api/endpoints/userApi";
import { UserRequest } from "@/types/User";


export const userService = {
    createUser: async(register: UserRequest)=>{
        const response=await userApi.create(register);
        return response.data;
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

import { api } from '../axios';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from '@/types/Auth';

import {  UserRequest, ListUserActive, UserName } from '@/types/User';

export interface UserSearchParams {

  page?: number;
  size?: number;
  isActive?: string;
}

export const userApi = {
  create: async (register:UserRequest): Promise<ApiResponse<User>> =>{
    console.log(register)
    const response=await  api.post('/api/auth/register',register);
    return response.data;
  },
  updateUser: async (id: number, userRequest: UserRequest): Promise<ApiResponse<User>> => {
    console.log(userRequest)
    const response = await api.put(`/api/admin/user/${id}`, userRequest);
    return response.data;
  },

  deactivateUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/api/admin/user/${id}/deactivate`);
    console.log(`/api/admin/user/${id}/deactivate`)
    return response.data;
  },

 tài khoản người dùng
    activateUser: async (id: number): Promise<ApiResponse<void>> => {
      const response = await api.patch(`/api/admin/user/${id}/activate`);
      return response.data;
    },

 // API lấy danh sách người dùng active
getActiveUsers: async (params: UserSearchParams): Promise<ApiResponse<ListUserActive>> => {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.append('page', params.page.toString());
  if (params.size) searchParams.append('size', params.size.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortDir) searchParams.append('sortDir', params.sortDir);
  if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

  const response = await api.get(`/api/admin/user/active?${searchParams.toString()}`);
  return response.data; // Đây là dữ liệu trả về từ API, bao gồm content và các trường khác.
},


  getInactiveUsers: async (params: UserSearchParams): Promise<ApiResponse<ListUserActive>> => {

    const searchParams = new URLSearchParams();
    searchParams.append('page', (params.page ?? 0).toString());
    searchParams.append('size', (params.size ?? 10).toString());
    searchParams.append('isActive', (params.isActive ?? "all").toString());
    const response = await api.get<ApiResponse<ListUserActive>>(
        `/api/admin/user/active?${searchParams.toString()}`
    );

    return response.data;
  },


  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/api/admin/user/${id}`);
    return response.data;
  },

  // Api lấy tất cả user(tên)
  getAllUser: async (): Promise<ApiResponse<UserName[]>> => {
    const response = await api.get('/api/admin/user');
    return response.data;
  }

};

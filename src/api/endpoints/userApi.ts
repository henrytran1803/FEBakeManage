import { api } from '../axios';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from '@/types/Auth';

import {  UserRequest, Page, ListUserActive } from '@/types/User';
import { register } from 'module';

interface UserSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  isActive?: boolean;
}

export const userApi = {
  //tạo người dùng
  create: async (register:UserRequest): Promise<ApiResponse<User>> =>{
    const response=await  api.post('/api/auth/register',register);
    return response.data;
  },
  // API sửa thông tin người dùng
  updateUser: async (id: number, userRequest: UserRequest): Promise<ApiResponse<User>> => {
    const response = await api.put(`/api/admin/user/${id}`, userRequest);
    return response.data;
  },

  // API khóa tài khoản người dùng
  deactivateUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/api/admin/user/${id}/deactivate`);
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


  // API lấy danh sách người dùng inactive
  getInactiveUsers: async (params: UserSearchParams): Promise<ApiResponse<ListUserActive>> => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size) searchParams.append('size', params.size.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDir) searchParams.append('sortDir', params.sortDir);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

    const response = await api.get(`/api/admin/user/inactive?${searchParams.toString()}`);
    return response.data;
  },

  // API lấy thông tin người dùng theo ID
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/api/admin/user/${id}`);
    return response.data;
  }
};

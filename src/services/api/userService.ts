import apiClient from './apiClient';
import { ApiResponse, User } from '@types/api';

export const userService = {
  // Lấy thông tin user
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  },

  // Cập nhật thông tin user
  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${userId}`, data);
    return response.data.data;
  },

  // Lấy danh sách users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },
};


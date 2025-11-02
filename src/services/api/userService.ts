import apiClient from './apiClient';
import { Account } from '@/types/api';

export const userService = {
  // Lấy thông tin user hiện tại từ /api/user/me
  getCurrentUser: async (): Promise<Account> => {
    const res = await apiClient.get('/api/user/me');
    return (res.data?.data ?? res.data) as Account;
  },
};


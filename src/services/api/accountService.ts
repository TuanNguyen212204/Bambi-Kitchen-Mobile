import apiClient from './apiClient';
import { Account, AccountUpdateRequest } from '@/types/api';

export const accountService = {
  async getAccount(id: number): Promise<Account> {
    const res = await apiClient.get<Account>(`/api/account/${id}`);
    return (res.data?.data ?? res.data) as Account;
  },

  async updateAccount(request: AccountUpdateRequest): Promise<Account> {
    const res = await apiClient.put<Account>('/api/account', request);
    return (res.data?.data ?? res.data) as Account;
  },

  async getAllAccounts(): Promise<Account[]> {
    const res = await apiClient.get<Account[]>('/api/account');
    return (res.data?.data ?? res.data ?? []) as Account[];
  },
};

export default accountService;


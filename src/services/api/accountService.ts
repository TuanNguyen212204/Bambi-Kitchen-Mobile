import apiClient from './apiClient';
import { Account, AccountUpdateRequest, AccountCreateRequest } from '@/types/api';

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

  async createAccount(request: AccountCreateRequest): Promise<Account> {
    const res = await apiClient.post<Account>('/api/account', request);
    return (res.data?.data ?? res.data) as Account;
  },

  async register(account: Account): Promise<Account> {
    const res = await apiClient.post<Account>('/api/account/register', account);
    return (res.data?.data ?? res.data) as Account;
  },

  async deleteAccount(id: number): Promise<string> {
    const res = await apiClient.delete<string>(`/api/account/${id}`);
    return (res.data?.data ?? res.data ?? '');
  },
};

export default accountService;


import apiClient from './apiClient';

import { Account, Orders, OrderStatusV3 } from '@/types/api.js';

export interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  orderByStatus: Record<string, number>;
}

export const getAllAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get<Account[]>('/api/account');
  return res.data ?? [];
};

export const getAllOrders = async (): Promise<Orders[]> => {
  const res = await apiClient.get<Orders[]>('/api/order');
  return res.data ?? [];
};

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const [accounts, orders] = await Promise.all([getAllAccounts(), getAllOrders()]);
    const totalUsers = accounts.length;
    const totalOrders = orders.length;
    const orderByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatusV3, number>);
    return {
      totalUsers,
      totalOrders,
      orderByStatus,
    };
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

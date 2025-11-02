import apiClient from './apiClient';
import { Account } from '@/types/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt?: string;
  account?: Account;
  read: boolean;
}

export interface NotificationSendingRequest {
  title: string;
  message: string;
  deviceToken?: string;
  userId?: number;
}

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>('/api/notification');
    return (res.data?.data ?? res.data ?? []) as Notification[];
  },

  getById: async (id: number): Promise<Notification> => {
    const res = await apiClient.get<Notification>(`/api/notification/${id}`);
    return (res.data?.data ?? res.data) as Notification;
  },

  getByAccountId: async (accountId: number): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>(`/api/notification/to-account/${accountId}`);
    return (res.data?.data ?? res.data ?? []) as Notification[];
  },

  create: async (notification: Notification): Promise<Notification> => {
    const res = await apiClient.post<Notification>('/api/notification', notification);
    return (res.data?.data ?? res.data) as Notification;
  },

  update: async (notification: Notification): Promise<Notification> => {
    const res = await apiClient.put<Notification>('/api/notification', notification);
    return (res.data?.data ?? res.data) as Notification;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`/api/notification/${id}/check-read`);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/notification/${id}`);
  },

  sendToUser: async (request: NotificationSendingRequest): Promise<string> => {
    const res = await apiClient.post<string>('/api/notification/send', request);
    return (res.data?.data ?? res.data ?? '');
  },

  sendToExactDevice: async (request: NotificationSendingRequest): Promise<string> => {
    const res = await apiClient.post<string>('/api/notification/send-to-exact', request);
    return (res.data?.data ?? res.data ?? '');
  },

  sendToAllUsers: async (request: NotificationSendingRequest): Promise<string> => {
    const res = await apiClient.post<string>('/api/notification/send-to-all', request);
    return (res.data?.data ?? res.data ?? '');
  },

  registerDeviceToken: async (deviceType: 'ANDROID' | 'WEB' | 'IOS'): Promise<string> => {
    const res = await apiClient.post<string>('/api/notification/device', deviceType);
    return (res.data?.data ?? res.data ?? '');
  },
};

export default notificationService;


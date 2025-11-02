import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '@utils/storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { toast } from '@utils/toast';

const BASE_URL = API_BASE_URL || 'https://bambi.kdz.asia';
const TIMEOUT = parseInt((API_TIMEOUT as any) || '30000', 10);

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem<string>('authToken');
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const method = (error?.config?.method || 'GET').toUpperCase?.();
    const url = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
    const data = error?.response?.data;
    const message = data?.message || error?.message || 'Network error';
    
    // Kiểm tra xem có token không
    const token = await storage.getItem<string>('authToken');
    const isUnauthenticated = status === 401 && !token;
    
    // Log chi tiết giúp debug nhanh lỗi 4xx/5xx và network
    if (__DEV__) {
      console.error('API Error:', { method, url, status, message, data });
      // Chỉ toast lỗi nếu không phải là 401 khi chưa login (tránh spam khi app mới start)
      // Hoặc nếu là lỗi khác (network, 500, etc.)
      if (!isUnauthenticated && (status !== 401 || token)) {
        toast.error(`${status || ''} ${message}`.trim());
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;


import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '@utils/storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';

// Cấu hình base URL từ .env (với fallback)
const BASE_URL = API_BASE_URL || 'https://bambi.kdz.asia';
const TIMEOUT = parseInt((API_TIMEOUT as any) || '30000', 10);

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('Response Error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        console.warn('Unauthorized access - redirect to login');
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;


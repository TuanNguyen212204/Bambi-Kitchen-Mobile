import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Cấu hình base URL từ .env (với fallback)
let BASE_URL = 'https://bambi.kdz.asia';
let TIMEOUT = 30000;

try {
  const { API_BASE_URL, API_TIMEOUT } = require('@env');
  BASE_URL = API_BASE_URL || 'https://bambi.kdz.asia';
  TIMEOUT = parseInt(API_TIMEOUT || '30000', 10);
} catch (error) {
  console.warn('No .env file found, using default API config');
}

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
  (config) => {
    // Thêm token vào headers nếu có
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log('Request:', config.method?.toUpperCase(), config.url);
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


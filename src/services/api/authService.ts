import apiClient from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  mail: string;
  password: string;
  role: 'USER' | 'STAFF' | 'ADMIN';
}

export const authService = {
  login: async (payload: LoginRequest): Promise<string> => {
    const res = await apiClient.post<string>('/api/user/login', payload);
    // API trả về token string
    return res.data as unknown as string;
  },

  me: async (): Promise<any> => {
    const res = await apiClient.get('/api/user/me');
    return res.data;
  },

  register: async (payload: RegisterRequest) => {
    const res = await apiClient.post('/api/account/register', payload);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.get('/api/user/forgot-password', { params: { email } });
    return res.data;
  },
};



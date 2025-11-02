import apiClient from './apiClient';
import { storage } from '@utils/storage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  mail: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'STAFF' | 'ADMIN';
}

export const authService = {
  login: async (payload: LoginRequest): Promise<string> => {
    const res = await apiClient.post<string>('/api/user/login', payload);
    const token = res.data as unknown as string;
    try {
      await storage.setItem('authToken', token);
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[AUTH] saved token.len=', token?.length, String(token || '').slice(0, 12));
      }
    } catch {}
    return token;
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

  sendOTP: async (email: string) => {
    const res = await apiClient.get('/api/mail/send-otp', { params: { email } });
    return res.data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const res = await apiClient.post('/api/mail/verify-otp', null, { params: { email, otp } });
    return res.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const res = await apiClient.post('/api/user/reset-password', null, { 
      params: { email, otp, newPassword } 
    });
    return res.data;
  },

  googleLogin: async (): Promise<string> => {
    // API trả về redirect URL, nhưng trên mobile chúng ta sẽ mở browser
    // và nhận token từ deep link callback
    // Format callback: bambi-kitchen-web.vercel.app/oauth2/callback?token=...
    const baseURL = apiClient.defaults.baseURL || 'https://bambi.kdz.asia';
    return `${baseURL}/api/user/login-with-google`;
  },
};



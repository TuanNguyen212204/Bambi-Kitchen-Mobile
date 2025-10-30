import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, LoginRequest } from '@services/api/authService';
import { setLoading, setToken, setUser, logout } from '../slices/authSlice';
import { storage } from '@utils/storage';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = await authService.login(payload);
      await storage.setItem('authToken', token);
      dispatch(setToken(token));
      const me = await authService.me();
      dispatch(setUser(me));
      return me;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const loadSessionThunk = createAsyncThunk('auth/loadSession', async (_, { dispatch }) => {
  const token = await storage.getItem<string>('authToken');
  if (token) {
    dispatch(setToken(token));
    try {
      const me = await authService.me();
      dispatch(setUser(me));
    } catch {
      await storage.removeItem('authToken');
      dispatch(logout());
    }
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await storage.removeItem('authToken');
  dispatch(logout());
});



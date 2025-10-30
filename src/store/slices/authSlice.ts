import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: number;
  name: string;
  mail?: string;
  role?: 'ADMIN' | 'STAFF' | 'USER' | string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    }
    , setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    }
    , setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
    , logout(state) {
      state.token = null;
      state.user = null;
    }
  },
});

export const { setToken, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;



import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  user: null | { id: string; name: string; email: string };
  setUser: (user: AppState['user']) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


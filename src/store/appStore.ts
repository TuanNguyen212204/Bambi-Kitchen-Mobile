import { create } from 'zustand';

interface AppState {
  // Counter example
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // User state (example)
  user: null | { id: string; name: string; email: string };
  setUser: (user: AppState['user']) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Counter
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // User
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


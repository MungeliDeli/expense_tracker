import { create } from 'zustand';
import { authApi } from '../lib/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,

  login: async (password: string, rememberMe: boolean) => {
    await authApi.login(password, rememberMe);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ isAuthenticated: false });
    }
  },

  verify: async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      await authApi.verify();
      set({ isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));

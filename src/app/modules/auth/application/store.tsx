import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  setSession: (token) => set({ token, isAuthenticated: true }),
  clearSession: () => set({ token: null, isAuthenticated: false }),
}));

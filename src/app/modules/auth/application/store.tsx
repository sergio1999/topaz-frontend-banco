import { create } from 'zustand';

import { IUser } from '../domain/i.auth';

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: IUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setSession: (token, user) => set({ token, user, isAuthenticated: true }),
  clearSession: () => set({ token: null, user: null, isAuthenticated: false }),
}));

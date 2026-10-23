import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  loadingMessage?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  loadingMessage: undefined,
  showLoading: (message) => set({ isLoading: true, loadingMessage: message }),
  hideLoading: () => set({ isLoading: false, loadingMessage: undefined }),
}));

export default useAppStore;

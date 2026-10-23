import { create } from 'zustand';

interface HomeState {
  isLoading: boolean;
  currency: string | null;
  accountBalance: number | null;
  setLoading: (isLoading: boolean) => void;
  setCurrency: (currency: string) => void;
  setAccountBalance: (accountBalance: number) => void;
  subtractFromBalance: (amount: number) => void;
  reset: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  isLoading: false,
  currency: null,
  accountBalance: null,
  setLoading: (isLoading) => set({ isLoading }),
  setCurrency: (currency) => set({ currency }),
  setAccountBalance: (accountBalance) => set({ accountBalance }),
  subtractFromBalance: (amount) =>
    set((state) =>
      state.accountBalance === null
        ? state
        : { accountBalance: Math.round((state.accountBalance - amount) * 100) / 100 },
    ),
  reset: () => set({ currency: null, accountBalance: null }),
}));

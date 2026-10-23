export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://qf5k9fspl0.execute-api.us-east-1.amazonaws.com/default';

export const BALANCE_BASE_URL =
  process.env.EXPO_PUBLIC_BALANCE_API_URL ?? 'https://2k0ic4z7s5.execute-api.us-east-1.amazonaws.com/default';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  HOME: {
    BALANCE: '/balance',
  },
} as const;

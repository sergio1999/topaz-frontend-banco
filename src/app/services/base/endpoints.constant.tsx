import { Platform } from 'react-native';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://qf5k9fspl0.execute-api.us-east-1.amazonaws.com/default';

// En web las peticiones pasan por el proxy de src/app/api (evita CORS).
export const BASE_URL = Platform.OS === 'web' ? '/api' : API_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
} as const;

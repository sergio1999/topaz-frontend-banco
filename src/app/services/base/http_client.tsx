import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { BASE_URL } from './endpoints.constant';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export interface HttpRequestConfig<D = unknown> extends AxiosRequestConfig<D> {}

export interface HttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>;
  post<T, D = unknown>(url: string, body?: D, config?: HttpRequestConfig<D>): Promise<T>;
  put<T, D = unknown>(url: string, body?: D, config?: HttpRequestConfig<D>): Promise<T>;
  patch<T, D = unknown>(url: string, body?: D, config?: HttpRequestConfig<D>): Promise<T>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? error.message,
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  },
);

export const httpClient: HttpClient = {
  get: async (url, config) => (await instance.get(url, config)).data,
  post: async (url, body, config) => (await instance.post(url, body, config)).data,
  put: async (url, body, config) => (await instance.put(url, body, config)).data,
  patch: async (url, body, config) => (await instance.patch(url, body, config)).data,
  delete: async (url, config) => (await instance.delete(url, config)).data,
};

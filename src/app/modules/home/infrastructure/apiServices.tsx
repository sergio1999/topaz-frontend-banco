import { BALANCE_BASE_URL, ENDPOINTS } from '../../../services/base/endpoints.constant';
import { httpClient } from '../../../services/base/http_client';
import { IBalanceResponse } from '../domain/i.balance';

export const getBalanceService = (token: string) =>
  httpClient.get<IBalanceResponse>(ENDPOINTS.HOME.BALANCE, {
    baseURL: BALANCE_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

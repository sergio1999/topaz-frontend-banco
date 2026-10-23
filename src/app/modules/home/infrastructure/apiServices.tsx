import { BALANCE_BASE_URL, ENDPOINTS, TRANSFER_BASE_URL } from '../../../services/base/endpoints.constant';
import { httpClient } from '../../../services/base/http_client';
import { IBalanceResponse } from '../domain/i.balance';
import { ITransferListResponse } from '../domain/i.tranfer';

export const getBalanceService = (token: string) =>
  httpClient.get<IBalanceResponse>(ENDPOINTS.HOME.BALANCE, {
    baseURL: BALANCE_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTransferListService = (token: string) =>
  httpClient.get<ITransferListResponse>(ENDPOINTS.HOME.TRANSFER_LIST, {
    baseURL: TRANSFER_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

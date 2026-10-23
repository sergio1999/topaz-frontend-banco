import {
  BALANCE_BASE_URL,
  ENDPOINTS,
  MAKE_TRANSFER_BASE_URL,
  TRANSFER_BASE_URL,
} from '../../../../services/base/endpoints.constant';
import { httpClient } from '../../../../services/base/http_client';
import { getBalanceService, getTransferListService, makeTransferService } from '../apiServices';

jest.mock('../../../../services/base/http_client', () => ({
  httpClient: { get: jest.fn(), post: jest.fn() },
}));

const TOKEN = 'abc123';
const AUTH_HEADERS = { Authorization: `Bearer ${TOKEN}` };

describe('home apiServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBalanceService hace GET a /balance con su base URL y el token', async () => {
    const response = { currency: 'BRL', accountBalance: 1500.5 };
    (httpClient.get as jest.Mock).mockResolvedValue(response);

    const result = await getBalanceService(TOKEN);

    expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.HOME.BALANCE, {
      baseURL: BALANCE_BASE_URL,
      headers: AUTH_HEADERS,
    });
    expect(result).toEqual(response);
  });

  it('getTransferListService hace GET a /transferList con su base URL y el token', async () => {
    const response = { mesage: 'ok', transfers: [] };
    (httpClient.get as jest.Mock).mockResolvedValue(response);

    const result = await getTransferListService(TOKEN);

    expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.HOME.TRANSFER_LIST, {
      baseURL: TRANSFER_BASE_URL,
      headers: AUTH_HEADERS,
    });
    expect(result).toEqual(response);
  });

  it('makeTransferService hace POST a /transfer con el request, su base URL y el token', async () => {
    const response = { status: 'success' };
    (httpClient.post as jest.Mock).mockResolvedValue(response);
    const request = {
      value: 100,
      currency: 'BRL',
      payeerDocument: '12345678900',
      transferDate: '2026-03-27',
    };

    const result = await makeTransferService(TOKEN, request);

    expect(httpClient.post).toHaveBeenCalledWith(ENDPOINTS.HOME.TRANSFER, request, {
      baseURL: MAKE_TRANSFER_BASE_URL,
      headers: AUTH_HEADERS,
    });
    expect(result).toEqual(response);
  });

  it('propaga el error del cliente HTTP', async () => {
    const error = { status: 401, message: 'No autorizado' };
    (httpClient.get as jest.Mock).mockRejectedValue(error);

    await expect(getBalanceService(TOKEN)).rejects.toEqual(error);
  });

  it('cada servicio usa un host distinto', () => {
    const hosts = new Set([BALANCE_BASE_URL, TRANSFER_BASE_URL, MAKE_TRANSFER_BASE_URL]);
    expect(hosts.size).toBe(3);
  });
});

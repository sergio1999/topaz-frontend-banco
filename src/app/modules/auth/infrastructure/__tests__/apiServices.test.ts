import { loginService } from '../apiServices';
import { ENDPOINTS } from '../../../../services/base/endpoints.constant';
import { httpClient } from '../../../../services/base/http_client';

jest.mock('../../../../services/base/http_client', () => ({
  httpClient: { post: jest.fn() },
}));

describe('auth apiServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loginService hace POST al endpoint de login con el request', async () => {
    const response = { token: 't', user: { id: 1, name: 'Sergio', email: 'a@a.com' } };
    (httpClient.post as jest.Mock).mockResolvedValue(response);
    const request = { email: 'a@a.com', password: '123456' };

    const result = await loginService(request);

    expect(httpClient.post).toHaveBeenCalledWith(ENDPOINTS.AUTH.LOGIN, request);
    expect(result).toEqual(response);
  });

  it('loginService propaga el error del cliente HTTP', async () => {
    const error = { status: 401, message: 'Credenciales inválidas' };
    (httpClient.post as jest.Mock).mockRejectedValue(error);

    await expect(loginService({ email: 'a@a.com', password: 'x' })).rejects.toEqual(error);
  });
});

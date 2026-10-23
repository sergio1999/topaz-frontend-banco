import { ENDPOINTS } from '../../../services/base/endpoints.constant';
import { httpClient } from '../../../services/base/http_client';
import { ILoginRequest, ILoginResponse } from '../domain/i.auth';

export const loginService = (request: ILoginRequest) =>
  httpClient.post<ILoginResponse, ILoginRequest>(ENDPOINTS.AUTH.LOGIN, request);

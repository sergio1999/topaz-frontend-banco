import { useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { ILoginRequest } from '../domain/i.auth';
import { loginService } from '../infrastructure/apiServices';
import { useAuthStore } from './store';

export function useCaseAuth() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);

  const login = async (request: ILoginRequest) => {
    showLoading('Iniciando sesión...');
    try {
      const response = await loginService(request);
      console.log(response);
      setSession(response.token, response.user);
    } catch (error) {
      setErrorMessage((error as ApiError).message ?? 'No se pudo iniciar sesión');
    } finally {
      hideLoading();
    }
  };

  const clearError = () => setErrorMessage(null);

  return { login, errorMessage, clearError };
}

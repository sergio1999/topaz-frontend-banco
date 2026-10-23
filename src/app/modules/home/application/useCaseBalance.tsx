import { useCallback, useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { useAuthStore } from '../../auth/application/store';
import { getBalanceService } from '../infrastructure/apiServices';
import { useHomeStore } from './store';

export function useCaseBalance() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);
  const setCurrency = useHomeStore((state) => state.setCurrency);
  const setAccountBalance = useHomeStore((state) => state.setAccountBalance);

  const fetchBalance = useCallback(async () => {
    if (!token) return;

    showLoading('Consultando saldo...');
    try {
      const response = await getBalanceService(token);
      console.log(response);
      setAccountBalance(response.accountBalance);
      setCurrency(response.currency);
    } catch (error) {
      setErrorMessage((error as ApiError).message ?? 'No se pudo consultar el saldo');
    } finally {
      hideLoading();
    }
  }, [token, showLoading, hideLoading, setCurrency, setAccountBalance]);

  const clearError = () => setErrorMessage(null);

  return { errorMessage, fetchBalance, clearError };
}

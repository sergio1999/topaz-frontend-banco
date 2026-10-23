import { useCallback, useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { useAuthStore } from '../../auth/application/store';
import { IBalanceResponse } from '../domain/i.balance';
import { getBalanceService } from '../infrastructure/apiServices';

export function useCaseBalance() {
  const [balance, setBalance] = useState<IBalanceResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);

  const fetchBalance = useCallback(async () => {
    if (!token) return;

    showLoading('Consultando saldo...');
    try {
      setBalance(await getBalanceService(token));
    } catch (error) {
      setErrorMessage((error as ApiError).message ?? 'No se pudo consultar el saldo');
    } finally {
      hideLoading();
    }
  }, [token, showLoading, hideLoading]);

  const clearError = () => setErrorMessage(null);

  return { balance, errorMessage, fetchBalance, clearError };
}

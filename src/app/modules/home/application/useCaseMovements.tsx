import { useCallback, useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { useAuthStore } from '../../auth/application/store';
import { ITransfer } from '../domain/i.tranfer';
import { getTransferListService } from '../infrastructure/apiServices';

export function useCaseMovements() {
  const [transfers, setTransfers] = useState<ITransfer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);

  const fetchTransfers = useCallback(async () => {
    if (!token) return;

    showLoading('Consultando movimientos...');
    try {
      const response = await getTransferListService(token);
      setTransfers(response.transfers);
    } catch (error) {
      setErrorMessage((error as ApiError).message ?? 'No se pudieron consultar los movimientos');
    } finally {
      hideLoading();
    }
  }, [token, showLoading, hideLoading]);

  const clearError = () => setErrorMessage(null);

  return { transfers, errorMessage, fetchTransfers, clearError };
}

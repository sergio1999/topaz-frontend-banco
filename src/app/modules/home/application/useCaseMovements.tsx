import { useCallback, useMemo, useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { useAuthStore } from '../../auth/application/store';
import {
  EMPTY_MOVEMENT_FILTERS,
  IMovementFilters,
  ITransfer,
} from '../domain/i.tranfer';
import { getTransferListService } from '../infrastructure/apiServices';

const toISODate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const applyMovementFilters = (transfers: ITransfer[], filters: IMovementFilters) => {
  const payeer = filters.payeer.trim().toLowerCase();
  const amount = Number(filters.value.replace(',', '.'));
  const hasValue = filters.value.trim().length > 0 && Number.isFinite(amount);
  const date = filters.date ? toISODate(filters.date) : null;

  return transfers.filter((transfer) => {
    const matchesPayeer =
      payeer.length === 0 ||
      transfer.payeer.name.toLowerCase().includes(payeer) ||
      transfer.payeer.document.includes(payeer);
    const matchesValue = !hasValue || transfer.value === amount;
    const matchesDate = date === null || transfer.date === date;

    return matchesPayeer && matchesValue && matchesDate;
  });
};

export function useCaseMovements() {
  const [transfers, setTransfers] = useState<ITransfer[]>([]);
  const [filters, setFilters] = useState<IMovementFilters>(EMPTY_MOVEMENT_FILTERS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);

  const filteredTransfers = useMemo(
    () => applyMovementFilters(transfers, filters),
    [transfers, filters],
  );

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

  return {
    transfers,
    filteredTransfers,
    filters,
    setFilters,
    errorMessage,
    fetchTransfers,
    clearError,
  };
}

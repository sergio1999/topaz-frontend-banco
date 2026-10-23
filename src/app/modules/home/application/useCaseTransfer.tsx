import { useState } from 'react';

import { ApiError } from '../../../services/base/http_client';
import { useAppStore } from '../../../store';
import { useAuthStore } from '../../auth/application/store';
import { ITransferRequest } from '../domain/i.tranfer';
import { makeTransferService } from '../infrastructure/apiServices';
import { useHomeStore } from './store';

const todayISO = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

export function useCaseTransfer() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const showLoading = useAppStore((state) => state.showLoading);
  const hideLoading = useAppStore((state) => state.hideLoading);
  const subtractFromBalance = useHomeStore((state) => state.subtractFromBalance);

  const transfer = async (request: Omit<ITransferRequest, 'transferDate'>): Promise<boolean> => {
    if (!token) return false;

    showLoading('Realizando transferencia...');
    try {
      const response = await makeTransferService(token, { ...request, transferDate: todayISO() });
      console.log(response)
      if (response.status !== 'success') {
        setErrorMessage('No se pudo realizar la transferencia');
        return false;
      }
      console.log('saldo antes', useHomeStore.getState().accountBalance, 'valor', request.value);
      subtractFromBalance(request.value);
      console.log('saldo despues', useHomeStore.getState().accountBalance);
      setSuccessMessage('Transferencia realizada con éxito');
      return true;
    } catch (error) {
      setErrorMessage((error as ApiError).message ?? 'No se pudo realizar la transferencia');
      return false;
    } finally {
      hideLoading();
    }
  };

  const clearError = () => setErrorMessage(null);
  const clearSuccess = () => setSuccessMessage(null);

  return { transfer, errorMessage, successMessage, clearError, clearSuccess };
}

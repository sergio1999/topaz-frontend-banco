import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '@/app/modules/auth/application/store';
import { useAppStore } from '@/app/store';

import { getBalanceService } from '../../infrastructure/apiServices';
import { useHomeStore } from '../store';
import { useCaseBalance } from '../useCaseBalance';

jest.mock('../../infrastructure/apiServices', () => ({
  getBalanceService: jest.fn(),
}));

const USER = { id: 1, name: 'Sergio', email: 'a@a.com' };

describe('useCaseBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    useAuthStore.setState({ token: 'abc123', user: USER, isAuthenticated: true });
    useAppStore.setState({ isLoading: false, loadingMessage: undefined });
    useHomeStore.setState({ currency: null, accountBalance: null });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('no consulta el saldo si no hay token', async () => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    const { result } = await renderHook(() => useCaseBalance());

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(getBalanceService).not.toHaveBeenCalled();
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('guarda saldo y moneda en el store cuando el servicio responde', async () => {
    (getBalanceService as jest.Mock).mockResolvedValue({ currency: 'BRL', accountBalance: 1500.5 });
    const { result } = await renderHook(() => useCaseBalance());

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(getBalanceService).toHaveBeenCalledWith('abc123');
    expect(useHomeStore.getState().accountBalance).toBe(1500.5);
    expect(useHomeStore.getState().currency).toBe('BRL');
    expect(result.current.errorMessage).toBeNull();
  });

  it('muestra el loader mientras consulta y lo oculta al terminar', async () => {
    let resolveBalance: (value: unknown) => void = () => {};
    (getBalanceService as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveBalance = resolve;
      }),
    );
    const { result } = await renderHook(() => useCaseBalance());

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.fetchBalance();
    });
    expect(useAppStore.getState().isLoading).toBe(true);
    expect(useAppStore.getState().loadingMessage).toBe('Consultando saldo...');

    await act(async () => {
      resolveBalance({ currency: 'BRL', accountBalance: 10 });
      await pending;
    });
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('guarda el mensaje de error cuando el servicio falla y no modifica el saldo', async () => {
    (getBalanceService as jest.Mock).mockRejectedValue({ status: 401, message: 'No autorizado' });
    const { result } = await renderHook(() => useCaseBalance());

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(result.current.errorMessage).toBe('No autorizado');
    expect(useHomeStore.getState().accountBalance).toBeNull();
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('usa un mensaje por defecto si el error no trae mensaje', async () => {
    (getBalanceService as jest.Mock).mockRejectedValue({});
    const { result } = await renderHook(() => useCaseBalance());

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(result.current.errorMessage).toBe('No se pudo consultar el saldo');
  });

  it('clearError limpia el mensaje de error', async () => {
    (getBalanceService as jest.Mock).mockRejectedValue({ message: 'Error' });
    const { result } = await renderHook(() => useCaseBalance());
    await act(async () => {
      await result.current.fetchBalance();
    });

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});

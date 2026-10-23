import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '@/app/modules/auth/application/store';
import { useAppStore } from '@/app/store';

import { makeTransferService } from '../../infrastructure/apiServices';
import { useHomeStore } from '../store';
import { useCaseTransfer } from '../useCaseTransfer';

jest.mock('../../infrastructure/apiServices', () => ({
  makeTransferService: jest.fn(),
}));

const USER = { id: 1, name: 'Sergio', email: 'a@a.com' };
const REQUEST = { value: 100, currency: 'BRL', payeerDocument: '12345678900' };

describe('useCaseTransfer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    useAuthStore.setState({ token: 'abc123', user: USER, isAuthenticated: true });
    useAppStore.setState({ isLoading: false, loadingMessage: undefined });
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('no transfiere y devuelve false si no hay token', async () => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    const { result } = await renderHook(() => useCaseTransfer());

    let success = true;
    await act(async () => {
      success = await result.current.transfer(REQUEST);
    });

    expect(success).toBe(false);
    expect(makeTransferService).not.toHaveBeenCalled();
  });

  it('envía la transferencia con el token y la fecha de hoy', async () => {
    (makeTransferService as jest.Mock).mockResolvedValue({ status: 'success' });
    const { result } = await renderHook(() => useCaseTransfer());

    await act(async () => {
      await result.current.transfer(REQUEST);
    });

    expect(makeTransferService).toHaveBeenCalledWith('abc123', {
      ...REQUEST,
      transferDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });

  it('con respuesta success devuelve true, descuenta el saldo y muestra el mensaje de éxito', async () => {
    (makeTransferService as jest.Mock).mockResolvedValue({ status: 'success' });
    const { result } = await renderHook(() => useCaseTransfer());

    let success = false;
    await act(async () => {
      success = await result.current.transfer(REQUEST);
    });

    expect(success).toBe(true);
    expect(useHomeStore.getState().accountBalance).toBe(1400.5);
    expect(result.current.successMessage).toBe('Transferencia realizada con éxito');
    expect(result.current.errorMessage).toBeNull();
  });

  it('si el status no es success devuelve false, muestra error y no descuenta el saldo', async () => {
    (makeTransferService as jest.Mock).mockResolvedValue({ status: 'failed' });
    const { result } = await renderHook(() => useCaseTransfer());

    let success = true;
    await act(async () => {
      success = await result.current.transfer(REQUEST);
    });

    expect(success).toBe(false);
    expect(useHomeStore.getState().accountBalance).toBe(1500.5);
    expect(result.current.errorMessage).toBe('No se pudo realizar la transferencia');
    expect(result.current.successMessage).toBeNull();
  });

  it('si el servicio falla devuelve false y guarda el mensaje del error', async () => {
    (makeTransferService as jest.Mock).mockRejectedValue({ message: 'Saldo insuficiente' });
    const { result } = await renderHook(() => useCaseTransfer());

    let success = true;
    await act(async () => {
      success = await result.current.transfer(REQUEST);
    });

    expect(success).toBe(false);
    expect(result.current.errorMessage).toBe('Saldo insuficiente');
    expect(useHomeStore.getState().accountBalance).toBe(1500.5);
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('usa un mensaje por defecto si el error no trae mensaje', async () => {
    (makeTransferService as jest.Mock).mockRejectedValue({});
    const { result } = await renderHook(() => useCaseTransfer());

    await act(async () => {
      await result.current.transfer(REQUEST);
    });

    expect(result.current.errorMessage).toBe('No se pudo realizar la transferencia');
  });

  it('muestra el loader mientras transfiere y lo oculta al terminar', async () => {
    let resolveTransfer: (value: unknown) => void = () => {};
    (makeTransferService as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveTransfer = resolve;
      }),
    );
    const { result } = await renderHook(() => useCaseTransfer());

    let pending: Promise<boolean> = Promise.resolve(false);
    await act(async () => {
      pending = result.current.transfer(REQUEST);
    });
    expect(useAppStore.getState().isLoading).toBe(true);
    expect(useAppStore.getState().loadingMessage).toBe('Realizando transferencia...');

    await act(async () => {
      resolveTransfer({ status: 'success' });
      await pending;
    });
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('clearError y clearSuccess limpian los mensajes', async () => {
    (makeTransferService as jest.Mock).mockResolvedValueOnce({ status: 'success' });
    const { result } = await renderHook(() => useCaseTransfer());
    await act(async () => {
      await result.current.transfer(REQUEST);
    });
    expect(result.current.successMessage).not.toBeNull();

    await act(async () => {
      result.current.clearSuccess();
    });
    expect(result.current.successMessage).toBeNull();

    (makeTransferService as jest.Mock).mockRejectedValueOnce({ message: 'Error' });
    await act(async () => {
      await result.current.transfer(REQUEST);
    });
    expect(result.current.errorMessage).toBe('Error');

    await act(async () => {
      result.current.clearError();
    });
    expect(result.current.errorMessage).toBeNull();
  });
});

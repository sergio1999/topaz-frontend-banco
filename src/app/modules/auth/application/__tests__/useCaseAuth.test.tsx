import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '../store';
import { useCaseAuth } from '../useCaseAuth';
import { loginService } from '../../infrastructure/apiServices';
import { useAppStore } from '../../../../store';

jest.mock('../../infrastructure/apiServices', () => ({
  loginService: jest.fn(),
}));

const REQUEST = { email: 'a@a.com', password: '123456' };
const RESPONSE = { token: 'abc123', user: { id: 1, name: 'Sergio', email: 'a@a.com' } };

describe('useCaseAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    useAppStore.setState({ isLoading: false, loadingMessage: undefined });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('inicia sin mensaje de error', async () => {
    const { result } = await renderHook(() => useCaseAuth());
    expect(result.current.errorMessage).toBeNull();
  });

  it('login exitoso guarda la sesión en el store', async () => {
    (loginService as jest.Mock).mockResolvedValue(RESPONSE);
    const { result } = await renderHook(() => useCaseAuth());

    await act(async () => {
      await result.current.login(REQUEST);
    });

    expect(loginService).toHaveBeenCalledWith(REQUEST);
    const state = useAuthStore.getState();
    expect(state.token).toBe('abc123');
    expect(state.user).toEqual(RESPONSE.user);
    expect(state.isAuthenticated).toBe(true);
    expect(result.current.errorMessage).toBeNull();
  });

  it('muestra el loader mientras espera la respuesta y lo oculta al terminar', async () => {
    let resolveLogin: (value: typeof RESPONSE) => void = () => {};
    (loginService as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    const { result } = await renderHook(() => useCaseAuth());

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.login(REQUEST);
    });
    expect(useAppStore.getState().isLoading).toBe(true);
    expect(useAppStore.getState().loadingMessage).toBe('Iniciando sesión...');

    await act(async () => {
      resolveLogin(RESPONSE);
      await pending;
    });
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('guarda el mensaje de error cuando el servicio falla y no inicia sesión', async () => {
    (loginService as jest.Mock).mockRejectedValue({
      status: 401,
      message: 'Credenciales inválidas',
    });
    const { result } = await renderHook(() => useCaseAuth());

    await act(async () => {
      await result.current.login(REQUEST);
    });

    expect(result.current.errorMessage).toBe('Credenciales inválidas');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('usa un mensaje por defecto si el error no trae mensaje', async () => {
    (loginService as jest.Mock).mockRejectedValue({});
    const { result } = await renderHook(() => useCaseAuth());

    await act(async () => {
      await result.current.login(REQUEST);
    });

    expect(result.current.errorMessage).toBe('No se pudo iniciar sesión');
  });

  it('clearError limpia el mensaje de error', async () => {
    (loginService as jest.Mock).mockRejectedValue({ message: 'Error' });
    const { result } = await renderHook(() => useCaseAuth());
    await act(async () => {
      await result.current.login(REQUEST);
    });
    expect(result.current.errorMessage).toBe('Error');

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});

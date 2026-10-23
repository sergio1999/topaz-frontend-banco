import { useAuthStore } from '../store';

const USER = { id: 1, name: 'Sergio', email: 'sergio@topaz.com' };

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('inicia sin sesión', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setSession guarda token y usuario y marca la sesión como autenticada', () => {
    useAuthStore.getState().setSession('abc123', USER);

    const state = useAuthStore.getState();
    expect(state.token).toBe('abc123');
    expect(state.user).toEqual(USER);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clearSession limpia la sesión', () => {
    useAuthStore.getState().setSession('abc123', USER);
    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

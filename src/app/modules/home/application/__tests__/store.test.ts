import { useHomeStore } from '../store';

describe('useHomeStore', () => {
  beforeEach(() => {
    useHomeStore.setState({ isLoading: false, currency: null, accountBalance: null });
  });

  it('inicia sin moneda ni saldo', () => {
    const state = useHomeStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.currency).toBeNull();
    expect(state.accountBalance).toBeNull();
  });

  it('setLoading actualiza el estado de carga', () => {
    useHomeStore.getState().setLoading(true);
    expect(useHomeStore.getState().isLoading).toBe(true);
  });

  it('setCurrency guarda la moneda', () => {
    useHomeStore.getState().setCurrency('BRL');
    expect(useHomeStore.getState().currency).toBe('BRL');
  });

  it('setAccountBalance guarda el saldo', () => {
    useHomeStore.getState().setAccountBalance(1500.5);
    expect(useHomeStore.getState().accountBalance).toBe(1500.5);
  });

  it('subtractFromBalance resta el monto al saldo', () => {
    useHomeStore.getState().setAccountBalance(1500.5);
    useHomeStore.getState().subtractFromBalance(100);
    expect(useHomeStore.getState().accountBalance).toBe(1400.5);
  });

  it('subtractFromBalance redondea a 2 decimales para evitar errores de coma flotante', () => {
    useHomeStore.getState().setAccountBalance(0.3);
    useHomeStore.getState().subtractFromBalance(0.1);
    expect(useHomeStore.getState().accountBalance).toBe(0.2);
  });

  it('subtractFromBalance no hace nada si el saldo aún no se cargó', () => {
    useHomeStore.getState().subtractFromBalance(100);
    expect(useHomeStore.getState().accountBalance).toBeNull();
  });

  it('reset limpia la moneda y el saldo', () => {
    useHomeStore.getState().setCurrency('BRL');
    useHomeStore.getState().setAccountBalance(1500.5);

    useHomeStore.getState().reset();

    expect(useHomeStore.getState().currency).toBeNull();
    expect(useHomeStore.getState().accountBalance).toBeNull();
  });
});

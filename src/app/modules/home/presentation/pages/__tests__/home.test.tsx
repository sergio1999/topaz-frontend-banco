import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '@/test-utils/render';

import { useHomeStore } from '../../../application/store';
import { useCaseBalance } from '../../../application/useCaseBalance';
import HomePage from '../home';

jest.mock('../../../application/useCaseBalance', () => ({
  useCaseBalance: jest.fn(),
}));

const fetchBalance = jest.fn();
const clearError = jest.fn();

const mockUseCase = (errorMessage: string | null = null) =>
  (useCaseBalance as jest.Mock).mockReturnValue({ errorMessage, fetchBalance, clearError });

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase();
    useHomeStore.setState({ currency: null, accountBalance: null });
  });

  it('pide el saldo al entrar si todavía no está cargado', async () => {
    await renderWithProviders(<HomePage />);
    expect(fetchBalance).toHaveBeenCalledTimes(1);
  });

  it('no vuelve a pedir el saldo si ya está cargado', async () => {
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
    await renderWithProviders(<HomePage />);
    expect(fetchBalance).not.toHaveBeenCalled();
  });

  it('muestra la tarjeta de saldo', async () => {
    const { getByText } = await renderWithProviders(<HomePage />);
    expect(getByText('Saldo disponible')).toBeTruthy();
  });

  it('muestra el saldo cuando ya está en el store', async () => {
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
    const { getByText } = await renderWithProviders(<HomePage />);
    expect(getByText(/500,50/)).toBeTruthy();
  });

  it('muestra la alerta de error y la cierra con clearError', async () => {
    mockUseCase('No se pudo consultar el saldo');
    const { getByText } = await renderWithProviders(<HomePage />);

    expect(getByText('No se pudo consultar el saldo')).toBeTruthy();
    await fireEvent.press(getByText('Aceptar'));

    expect(clearError).toHaveBeenCalledTimes(1);
  });
});

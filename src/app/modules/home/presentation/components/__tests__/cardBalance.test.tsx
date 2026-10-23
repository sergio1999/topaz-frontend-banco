import { renderWithProviders } from '@/test-utils/render';

import { useHomeStore } from '../../../application/store';
import CardBalance from '../cardBalance';

describe('CardBalance', () => {
  beforeEach(() => {
    useHomeStore.setState({ currency: null, accountBalance: null });
  });

  it('muestra el título "Saldo disponible"', async () => {
    const { getByText } = await renderWithProviders(<CardBalance />);
    expect(getByText('Saldo disponible')).toBeTruthy();
  });

  it('no muestra monto si el saldo aún no se cargó', async () => {
    const { queryByText } = await renderWithProviders(<CardBalance />);
    expect(queryByText(/500,50/)).toBeNull();
  });

  it('no muestra monto si falta la moneda', async () => {
    useHomeStore.setState({ currency: null, accountBalance: 1500.5 });
    const { queryByText } = await renderWithProviders(<CardBalance />);
    expect(queryByText(/500,50/)).toBeNull();
  });

  it('muestra el saldo formateado con la moneda del store', async () => {
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
    const { getByText } = await renderWithProviders(<CardBalance />);
    expect(getByText(/500,50/)).toBeTruthy();
  });

  it('muestra el saldo en cero', async () => {
    useHomeStore.setState({ currency: 'BRL', accountBalance: 0 });
    const { getByText } = await renderWithProviders(<CardBalance />);
    expect(getByText(/0,00/)).toBeTruthy();
  });
});

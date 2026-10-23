import { fireEvent } from '@testing-library/react-native';

import { useAuthStore } from '@/app/modules/auth/application/store';
import { renderWithProviders } from '@/test-utils/render';

import { useHomeStore } from '../../../application/store';
import HomeLayout from '../homeLayout';

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Slot: () => <Text>contenido-hijo</Text>,
    router: { navigate: jest.fn() },
    usePathname: jest.fn(() => '/home'),
  };
});

describe('HomeLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: 'abc123',
      user: { id: 1, name: 'Sergio', email: 'a@a.com' },
      isAuthenticated: true,
    });
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
  });

  it('renderiza el header, el contenido hijo y la barra de navegación', async () => {
    const { getByText, getAllByText } = await renderWithProviders(<HomeLayout />);

    expect(getByText('Topaz')).toBeTruthy();
    expect(getByText('contenido-hijo')).toBeTruthy();
    expect(getAllByText('Inicio').length).toBeGreaterThan(0);
    expect(getAllByText('Movimientos').length).toBeGreaterThan(0);
    expect(getAllByText('Transferencias').length).toBeGreaterThan(0);
  });

  it('al cerrar sesión reinicia el store de home y limpia la sesión', async () => {
    const { getByLabelText } = await renderWithProviders(<HomeLayout />);

    await fireEvent.press(getByLabelText('Cerrar sesión'));

    expect(useHomeStore.getState().accountBalance).toBeNull();
    expect(useHomeStore.getState().currency).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });
});

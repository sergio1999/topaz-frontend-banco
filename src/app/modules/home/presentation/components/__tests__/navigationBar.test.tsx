import { fireEvent } from '@testing-library/react-native';
import { router, usePathname } from 'expo-router';

import { ROUTES } from '@/app/(pages)/routes';
import { renderWithProviders } from '@/test-utils/render';

import NavigationBar, { HOME_NAV_ITEMS } from '../navigationBar';

jest.mock('expo-router', () => ({
  router: { navigate: jest.fn() },
  usePathname: jest.fn(),
}));

describe('NavigationBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue(ROUTES.HOME);
  });

  it('define las pestañas Inicio, Movimientos y Transferencias con sus rutas', () => {
    expect(HOME_NAV_ITEMS.map((item) => [item.label, item.key])).toEqual([
      ['Inicio', ROUTES.HOME],
      ['Movimientos', ROUTES.HOME_MOVEMENTS],
      ['Transferencias', ROUTES.HOME_TRANSFERS],
    ]);
  });

  it('muestra todas las pestañas', async () => {
    const { getAllByText } = await renderWithProviders(<NavigationBar />);

    HOME_NAV_ITEMS.forEach((item) => {
      expect(getAllByText(item.label).length).toBeGreaterThan(0);
    });
  });

  it('navega a la ruta de la pestaña presionada', async () => {
    const { getByTestId } = await renderWithProviders(<NavigationBar />);

    await fireEvent(getByTestId(`nav-${ROUTES.HOME_TRANSFERS}`), 'click');

    expect(router.navigate).toHaveBeenCalledWith(ROUTES.HOME_TRANSFERS);
  });

  it('navega a Movimientos', async () => {
    const { getByTestId } = await renderWithProviders(<NavigationBar />);

    await fireEvent(getByTestId(`nav-${ROUTES.HOME_MOVEMENTS}`), 'click');

    expect(router.navigate).toHaveBeenCalledWith(ROUTES.HOME_MOVEMENTS);
  });
});

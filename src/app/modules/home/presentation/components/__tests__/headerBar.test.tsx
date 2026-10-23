import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '@/test-utils/render';

import HeaderBar from '../headerBar';

describe('HeaderBar', () => {
  it('muestra "Topaz" como título por defecto', async () => {
    const { getByText } = await renderWithProviders(<HeaderBar onLogout={jest.fn()} />);
    expect(getByText('Topaz')).toBeTruthy();
  });

  it('muestra un título personalizado', async () => {
    const { getByText } = await renderWithProviders(<HeaderBar title="Mi banco" onLogout={jest.fn()} />);
    expect(getByText('Mi banco')).toBeTruthy();
  });

  it('ejecuta onLogout al presionar el botón de cerrar sesión', async () => {
    const onLogout = jest.fn();
    const { getByLabelText } = await renderWithProviders(<HeaderBar onLogout={onLogout} />);

    await fireEvent.press(getByLabelText('Cerrar sesión'));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

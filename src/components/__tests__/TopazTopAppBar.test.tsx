import { fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazTopAppBar from '../TopazTopAppBar';

describe('TopazTopAppBar', () => {
  it('muestra el título', async () => {
    const { getByText } = await renderWithProviders(<TopazTopAppBar title="Topaz" />);
    expect(getByText('Topaz')).toBeTruthy();
  });

  it('ejecuta la acción al presionar su botón', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await renderWithProviders(
      <TopazTopAppBar
        title="Topaz"
        actions={[{ icon: 'logout', onPress, accessibilityLabel: 'Cerrar sesión' }]}
      />,
    );
    await fireEvent.press(getByLabelText('Cerrar sesión'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no muestra acciones si no recibe ninguna', async () => {
    const { queryByLabelText } = await renderWithProviders(<TopazTopAppBar title="Topaz" />);
    expect(queryByLabelText('Cerrar sesión')).toBeNull();
  });

  it('aplica el color del texto cuando recibe color', async () => {
    const { getByText } = await renderWithProviders(<TopazTopAppBar title="Topaz" color="#FFFFFF" />);

    expect(StyleSheet.flatten(getByText('Topaz').props.style).color).toBe('#FFFFFF');
  });

  it('muestra el logo cuando lo recibe', async () => {
    const { getByLabelText } = await renderWithProviders(
      <TopazTopAppBar title="Topaz" logo={{ uri: 'https://example.com/logo.png' }} />,
    );

    expect(getByLabelText('Logo')).toBeTruthy();
  });

  it('no muestra el logo si no lo recibe', async () => {
    const { queryByLabelText } = await renderWithProviders(<TopazTopAppBar title="Topaz" />);

    expect(queryByLabelText('Logo')).toBeNull();
  });

  it('funciona con color de fondo y color de texto a la vez', async () => {
    const { getByText } = await renderWithProviders(
      <TopazTopAppBar title="Topaz" backgroundColor="#1E1E68" color="#FFFFFF" />,
    );

    expect(getByText('Topaz')).toBeTruthy();
  });
});

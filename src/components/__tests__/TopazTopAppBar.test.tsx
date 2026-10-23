import { fireEvent } from '@testing-library/react-native';

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
});

import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazButton from '../TopazButton';

describe('TopazButton', () => {
  it('muestra el label', async () => {
    const { getByText } = await renderWithProviders(<TopazButton label="Ingresar" onPress={jest.fn()} />);
    expect(getByText('Ingresar')).toBeTruthy();
  });

  it('ejecuta onPress al presionar', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithProviders(<TopazButton label="Ingresar" onPress={onPress} />);
    await fireEvent.press(getByText('Ingresar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onPress cuando está deshabilitado', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithProviders(
      <TopazButton label="Ingresar" onPress={onPress} disabled />,
    );
    await fireEvent.press(getByText('Ingresar'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

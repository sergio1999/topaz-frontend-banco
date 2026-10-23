import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazSelect from '../TopazSelect';

const OPTIONS = [
  { label: 'BRL', value: 'BRL' },
  { label: 'USD', value: 'USD' },
];

jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const { View } = require('react-native');
  const Menu = ({ visible, anchor, children }: any) => (
    <View>
      {anchor}
      {visible && children}
    </View>
  );
  Menu.Item = actual.Menu.Item;
  return { ...actual, Menu };
});

describe('TopazSelect', () => {
  it('muestra la etiqueta de la opción seleccionada', async () => {
    const { getByDisplayValue } = await renderWithProviders(
      <TopazSelect label="Moneda" options={OPTIONS} value="BRL" onChange={jest.fn()} />,
    );
    expect(getByDisplayValue('BRL')).toBeTruthy();
  });

  it('queda vacío si el value no existe en las opciones', async () => {
    const { getByDisplayValue } = await renderWithProviders(
      <TopazSelect label="Moneda" options={OPTIONS} value="EUR" onChange={jest.fn()} />,
    );
    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('muestra el mensaje de error', async () => {
    const { getByText } = await renderWithProviders(
      <TopazSelect options={OPTIONS} onChange={jest.fn()} error="Selecciona una moneda" />,
    );
    expect(getByText('Selecciona una moneda')).toBeTruthy();
  });

  it('abre el menú y llama a onChange al elegir una opción', async () => {
    const onChange = jest.fn();
    const { getByTestId, findByText } = await renderWithProviders(
      <TopazSelect label="Moneda" options={OPTIONS} value="BRL" onChange={onChange} />,
    );
    await fireEvent.press(getByTestId('right-icon-adornment'));
    await fireEvent.press(await findByText('USD'));
    expect(onChange).toHaveBeenCalledWith('USD');
  });

  it('no abre el menú si está deshabilitado', async () => {
    const { getByTestId, queryByText } = await renderWithProviders(
      <TopazSelect label="Moneda" options={OPTIONS} value="BRL" onChange={jest.fn()} disabled />,
    );
    await fireEvent.press(getByTestId('right-icon-adornment'));
    expect(queryByText('USD')).toBeNull();
  });
});

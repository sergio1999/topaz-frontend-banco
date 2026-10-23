import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazSelectDate from '../TopazSelectDate';

jest.mock('react-native-paper-dates', () => {
  const { Pressable } = require('react-native');
  return {
    DatePickerModal: ({ visible, onConfirm }: any) =>
      visible ? (
        <Pressable testID="date-modal" onPress={() => onConfirm({ date: new Date(2026, 2, 27) })} />
      ) : null,
  };
});

describe('TopazSelectDate', () => {
  it('muestra la fecha en formato DD/MM/AAAA', async () => {
    const { getByDisplayValue } = await renderWithProviders(
      <TopazSelectDate label="Fecha" value={new Date(2026, 0, 5)} onChange={jest.fn()} />,
    );
    expect(getByDisplayValue('05/01/2026')).toBeTruthy();
  });

  it('queda vacío sin valor', async () => {
    const { getByDisplayValue } = await renderWithProviders(
      <TopazSelectDate label="Fecha" onChange={jest.fn()} />,
    );
    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('muestra el mensaje de error', async () => {
    const { getByText } = await renderWithProviders(
      <TopazSelectDate label="Fecha" onChange={jest.fn()} error="Requerida" />,
    );
    expect(getByText('Requerida')).toBeTruthy();
  });

  it('abre el selector y llama a onChange con la fecha elegida', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderWithProviders(
      <TopazSelectDate label="Fecha" onChange={onChange} />,
    );
    await fireEvent.press(getByTestId('right-icon-adornment'));
    await fireEvent.press(getByTestId('date-modal'));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 27));
  });

  it('no abre el selector si está deshabilitado', async () => {
    const { getByTestId, queryByTestId } = await renderWithProviders(
      <TopazSelectDate label="Fecha" onChange={jest.fn()} disabled />,
    );
    await fireEvent.press(getByTestId('right-icon-adornment'));
    expect(queryByTestId('date-modal')).toBeNull();
  });
});

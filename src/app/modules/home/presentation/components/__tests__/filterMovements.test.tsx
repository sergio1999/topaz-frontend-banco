import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '@/test-utils/render';

import { EMPTY_MOVEMENT_FILTERS, IMovementFilters } from '../../../domain/i.tranfer';
import FilterMovements from '../filterMovements';

jest.mock('react-native-paper-dates', () => {
  const { Pressable } = require('react-native');
  return {
    DatePickerModal: ({ visible, onConfirm }: any) =>
      visible ? (
        <Pressable testID="date-modal" onPress={() => onConfirm({ date: new Date(2026, 2, 20) })} />
      ) : null,
  };
});

const render = (filters: IMovementFilters = EMPTY_MOVEMENT_FILTERS) => {
  const onChange = jest.fn();
  return { onChange, utils: renderWithProviders(<FilterMovements filters={filters} onChange={onChange} />) };
};

describe('FilterMovements', () => {
  it('muestra los campos destinatario, valor y fecha', async () => {
    const { utils } = render();
    const { getAllByText, getByPlaceholderText } = await utils;

    expect(getAllByText('Destinatario').length).toBeGreaterThan(0);
    expect(getAllByText('Valor').length).toBeGreaterThan(0);
    expect(getAllByText('Fecha').length).toBeGreaterThan(0);
    expect(getByPlaceholderText('Nombre o documento')).toBeTruthy();
    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('muestra los valores recibidos en los campos', async () => {
    const { utils } = render({ payeer: 'Ana', value: '250', date: new Date(2026, 2, 20) });
    const { getByDisplayValue } = await utils;

    expect(getByDisplayValue('Ana')).toBeTruthy();
    expect(getByDisplayValue('250')).toBeTruthy();
    expect(getByDisplayValue('20/03/2026')).toBeTruthy();
  });

  it('llama a onChange con el destinatario escrito', async () => {
    const { utils, onChange } = render();
    const { getByPlaceholderText } = await utils;

    await fireEvent.changeText(getByPlaceholderText('Nombre o documento'), 'Ana');

    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_MOVEMENT_FILTERS, payeer: 'Ana' });
  });

  it('llama a onChange con el valor escrito', async () => {
    const { utils, onChange } = render();
    const { getByPlaceholderText } = await utils;

    await fireEvent.changeText(getByPlaceholderText('0.00'), '250.5');

    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_MOVEMENT_FILTERS, value: '250.5' });
  });

  it('ignora caracteres no numéricos y más de 2 decimales en el valor', async () => {
    const { utils, onChange } = render();
    const { getByPlaceholderText } = await utils;

    await fireEvent.changeText(getByPlaceholderText('0.00'), 'abc');
    await fireEvent.changeText(getByPlaceholderText('0.00'), '10.555');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('conserva los otros filtros al cambiar uno', async () => {
    const { utils, onChange } = render({ payeer: 'Ana', value: '', date: null });
    const { getByPlaceholderText } = await utils;

    await fireEvent.changeText(getByPlaceholderText('0.00'), '100');

    expect(onChange).toHaveBeenCalledWith({ payeer: 'Ana', value: '100', date: null });
  });

  it('llama a onChange con la fecha elegida en el calendario', async () => {
    const { utils, onChange } = render();
    const { getByTestId } = await utils;

    await fireEvent.press(getByTestId('right-icon-adornment'));
    await fireEvent.press(getByTestId('date-modal'));

    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_MOVEMENT_FILTERS, date: new Date(2026, 2, 20) });
  });

  it('no muestra "Limpiar filtros" cuando no hay filtros', async () => {
    const { utils } = render();
    const { queryByText } = await utils;

    expect(queryByText('Limpiar filtros')).toBeNull();
  });

  it('muestra "Limpiar filtros" cuando hay algún filtro y lo restablece al presionarlo', async () => {
    const { utils, onChange } = render({ payeer: 'Ana', value: '', date: null });
    const { getByText } = await utils;

    await fireEvent.press(getByText('Limpiar filtros'));

    expect(onChange).toHaveBeenCalledWith(EMPTY_MOVEMENT_FILTERS);
  });
});

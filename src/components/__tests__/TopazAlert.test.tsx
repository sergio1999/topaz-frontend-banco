import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazAlert from '../TopazAlert';

describe('TopazAlert', () => {
  it('muestra título y mensaje cuando es visible', async () => {
    const { getByText } = await renderWithProviders(
      <TopazAlert visible title="Error" message="Algo salió mal" />,
    );
    expect(getByText('Error')).toBeTruthy();
    expect(getByText('Algo salió mal')).toBeTruthy();
  });

  it('no muestra nada cuando no es visible', async () => {
    const { queryByText } = await renderWithProviders(
      <TopazAlert visible={false} title="Error" message="Algo salió mal" />,
    );
    expect(queryByText('Algo salió mal')).toBeNull();
  });

  it('ejecuta onConfirm con el botón por defecto "Aceptar"', async () => {
    const onConfirm = jest.fn();
    const { getByText } = await renderWithProviders(
      <TopazAlert visible message="Listo" onConfirm={onConfirm} />,
    );
    await fireEvent.press(getByText('Aceptar'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('muestra el botón cancelar y ejecuta onCancel cuando recibe cancelLabel', async () => {
    const onCancel = jest.fn();
    const { getByText } = await renderWithProviders(
      <TopazAlert visible message="¿Seguro?" cancelLabel="Cancelar" onCancel={onCancel} />,
    );
    await fireEvent.press(getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('no muestra cancelar sin cancelLabel', async () => {
    const { queryByText } = await renderWithProviders(<TopazAlert visible message="Listo" />);
    expect(queryByText('Cancelar')).toBeNull();
  });
});

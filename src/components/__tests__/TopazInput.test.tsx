import { fireEvent, render } from '@testing-library/react-native';

import TopazInput from '../TopazInput';

describe('TopazInput', () => {
  it('muestra el label', async () => {
    const { getByText } = await render(<TopazInput label="Correo" value="" onChangeText={jest.fn()} />);
    expect(getByText('Correo')).toBeTruthy();
  });

  it('muestra el valor recibido', async () => {
    const { getByDisplayValue } = await render(<TopazInput value="a@a.com" onChangeText={jest.fn()} />);
    expect(getByDisplayValue('a@a.com')).toBeTruthy();
  });

  it('llama a onChangeText al escribir', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = await render(
      <TopazInput value="" onChangeText={onChangeText} placeholder="correo" />,
    );
    await fireEvent.changeText(getByPlaceholderText('correo'), 'hola');
    expect(onChangeText).toHaveBeenCalledWith('hola');
  });

  it('muestra el mensaje de error', async () => {
    const { getByText } = await render(<TopazInput value="" onChangeText={jest.fn()} error="Requerido" />);
    expect(getByText('Requerido')).toBeTruthy();
  });

  it('no muestra error cuando no se recibe', async () => {
    const { queryByText } = await render(<TopazInput label="Correo" value="" onChangeText={jest.fn()} />);
    expect(queryByText('Requerido')).toBeNull();
  });
});

import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazAutocomplete from '../TopazAutocomplete';

const OPTIONS = [
  { label: 'Brasil', value: 'BR' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Chile', value: 'CL' },
];

describe('TopazAutocomplete', () => {
  it('muestra la etiqueta de la opción seleccionada', async () => {
    const { getByDisplayValue } = await renderWithProviders(
      <TopazAutocomplete label="País" options={OPTIONS} value="CL" onChange={jest.fn()} />,
    );
    expect(getByDisplayValue('Chile')).toBeTruthy();
  });

  it('filtra las sugerencias mientras se escribe', async () => {
    const { getByDisplayValue, queryByText, getByText } = await renderWithProviders(
      <TopazAutocomplete label="País" options={OPTIONS} value="CL" onChange={jest.fn()} />,
    );
    await fireEvent.changeText(getByDisplayValue('Chile'), 'bo');
    expect(getByText('Bolivia')).toBeTruthy();
    expect(queryByText('Chile')).toBeNull();
  });

  it('llama a onChange con el value al elegir una sugerencia', async () => {
    const onChange = jest.fn();
    const { getByPlaceholderText, getByText } = await renderWithProviders(
      <TopazAutocomplete
        placeholder="Buscar país"
        options={OPTIONS}
        onChange={onChange}
      />,
    );
    await fireEvent.changeText(getByPlaceholderText('Buscar país'), 'chi');
    await fireEvent.press(getByText('Chile'));
    expect(onChange).toHaveBeenCalledWith('CL');
  });

  it('llama a onChange con null al editar el texto tras elegir una opción', async () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = await renderWithProviders(
      <TopazAutocomplete label="País" options={OPTIONS} value="CL" onChange={onChange} />,
    );
    await fireEvent.changeText(getByDisplayValue('Chile'), 'Chil');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('respeta maxSuggestions', async () => {
    const { getByPlaceholderText, queryByText } = await renderWithProviders(
      <TopazAutocomplete
        placeholder="Buscar país"
        options={OPTIONS}
        onChange={jest.fn()}
        maxSuggestions={1}
      />,
    );
    await fireEvent.changeText(getByPlaceholderText('Buscar país'), 'b');
    expect(queryByText('Brasil')).toBeTruthy();
    expect(queryByText('Bolivia')).toBeNull();
  });

  it('muestra el mensaje de error', async () => {
    const { getByText } = await renderWithProviders(
      <TopazAutocomplete options={OPTIONS} onChange={jest.fn()} error="Requerido" />,
    );
    expect(getByText('Requerido')).toBeTruthy();
  });
});

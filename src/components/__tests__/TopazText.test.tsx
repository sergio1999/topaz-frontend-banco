import { renderWithProviders } from '../../test-utils/render';
import TopazText from '../TopazText';

describe('TopazText', () => {
  it('renderiza el texto recibido', async () => {
    const { getByText } = await renderWithProviders(<TopazText>Hola Topaz</TopazText>);
    expect(getByText('Hola Topaz')).toBeTruthy();
  });

  it('acepta una variante', async () => {
    const { getByText } = await renderWithProviders(<TopazText variant="titleLarge">Título</TopazText>);
    expect(getByText('Título')).toBeTruthy();
  });
});

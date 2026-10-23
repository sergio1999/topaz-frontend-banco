import { renderWithProviders } from '../../test-utils/render';
import TopazLoading from '../TopazLoading';

describe('TopazLoading', () => {
  it('no renderiza nada cuando visible es false', async () => {
    const { queryByText } = await renderWithProviders(
      <TopazLoading visible={false} message="Cargando..." />,
    );
    expect(queryByText('Cargando...')).toBeNull();
  });

  it('muestra el mensaje cuando visible es true', async () => {
    const { getByText } = await renderWithProviders(<TopazLoading visible message="Cargando..." />);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('funciona sin mensaje', async () => {
    const { queryByText } = await renderWithProviders(<TopazLoading visible />);
    expect(queryByText('Cargando...')).toBeNull();
  });
});

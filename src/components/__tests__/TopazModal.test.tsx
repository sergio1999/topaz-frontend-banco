import { Text } from 'react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazModal from '../TopazModal';

describe('TopazModal', () => {
  it('renderiza los children cuando es visible', async () => {
    const { getByText } = await renderWithProviders(
      <TopazModal visible onDismiss={jest.fn()}>
        <Text>Contenido</Text>
      </TopazModal>,
    );
    expect(getByText('Contenido')).toBeTruthy();
  });

  it('no renderiza los children cuando no es visible', async () => {
    const { queryByText } = await renderWithProviders(
      <TopazModal visible={false} onDismiss={jest.fn()}>
        <Text>Contenido</Text>
      </TopazModal>,
    );
    expect(queryByText('Contenido')).toBeNull();
  });
});

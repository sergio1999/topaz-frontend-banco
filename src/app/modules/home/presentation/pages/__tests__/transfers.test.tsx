import { renderWithProviders } from '@/test-utils/render';

import TransfersPage from '../transfers';

jest.mock('../../components/formTranfer', () => {
  const { Text } = require('react-native');
  return { __esModule: true, default: () => <Text>form-transfer</Text> };
});

describe('TransfersPage', () => {
  it('muestra el título', async () => {
    const { getByText } = await renderWithProviders(<TransfersPage />);
    expect(getByText('Transferencias')).toBeTruthy();
  });

  it('renderiza el formulario de transferencia', async () => {
    const { getByText } = await renderWithProviders(<TransfersPage />);
    expect(getByText('form-transfer')).toBeTruthy();
  });
});

import AuthPage from '../auth';
import { renderWithProviders } from '@/test-utils/render';

jest.mock('../../components/formLogin', () => {
  const { Text } = require('react-native');
  return { __esModule: true, default: () => <Text>form-login</Text> };
});

describe('AuthPage', () => {
  it('muestra el título de inicio de sesión', async () => {
    const { getByText } = await renderWithProviders(<AuthPage />);
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('renderiza el formulario de login', async () => {
    const { getByText } = await renderWithProviders(<AuthPage />);
    expect(getByText('form-login')).toBeTruthy();
  });
});

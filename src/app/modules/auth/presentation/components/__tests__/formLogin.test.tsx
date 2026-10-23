import { fireEvent } from '@testing-library/react-native';

import { useCaseAuth } from '../../../application/useCaseAuth';
import FormLogin from '../formLogin';
import { renderWithProviders } from '@/test-utils/render';

jest.mock('../../../application/useCaseAuth', () => ({
  useCaseAuth: jest.fn(),
}));

const login = jest.fn();
const clearError = jest.fn();

const mockUseCase = (errorMessage: string | null = null) =>
  (useCaseAuth as jest.Mock).mockReturnValue({ login, errorMessage, clearError });

describe('FormLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase();
  });

  it('muestra los campos y el botón', async () => {
    const { getByText, getAllByText, getByPlaceholderText } = await renderWithProviders(<FormLogin />);

    expect(getAllByText('Correo electrónico').length).toBeGreaterThan(0);
    expect(getAllByText('Contraseña').length).toBeGreaterThan(0);
    expect(getByPlaceholderText('correo@ejemplo.com')).toBeTruthy();
    expect(getByText('Ingresar')).toBeTruthy();
  });

  it('no permite enviar mientras los campos estén vacíos', async () => {
    const { getByText } = await renderWithProviders(<FormLogin />);

    await fireEvent.press(getByText('Ingresar'));

    expect(login).not.toHaveBeenCalled();
  });

  it('no permite enviar si solo se llenó el correo', async () => {
    const { getByText, getByPlaceholderText } = await renderWithProviders(<FormLogin />);

    await fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'a@a.com');
    await fireEvent.press(getByText('Ingresar'));

    expect(login).not.toHaveBeenCalled();
  });

  it('muestra error y no llama al servicio si el correo no es válido', async () => {
    const { getByText, getByPlaceholderText } = await renderWithProviders(<FormLogin />);

    await fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'correo-invalido');
    await fireEvent.changeText(getByPlaceholderText('••••••••'), '123456');
    await fireEvent.press(getByText('Ingresar'));

    expect(getByText('Ingresa un correo válido')).toBeTruthy();
    expect(login).not.toHaveBeenCalled();
  });

  it('llama a login con el correo sin espacios y la contraseña', async () => {
    const { getByText, getByPlaceholderText } = await renderWithProviders(<FormLogin />);

    await fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), '  a@a.com  ');
    await fireEvent.changeText(getByPlaceholderText('••••••••'), '123456');
    await fireEvent.press(getByText('Ingresar'));

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({ email: 'a@a.com', password: '123456' });
  });

  it('muestra la alerta de error cuando el caso de uso reporta un error', async () => {
    mockUseCase('Credenciales inválidas');
    const { getByText } = await renderWithProviders(<FormLogin />);

    expect(getByText('Credenciales inválidas')).toBeTruthy();
  });

  it('no muestra la alerta cuando no hay error', async () => {
    const { queryByText } = await renderWithProviders(<FormLogin />);

    expect(queryByText('Aceptar')).toBeNull();
  });

  it('cierra la alerta llamando a clearError', async () => {
    mockUseCase('Credenciales inválidas');
    const { getByText } = await renderWithProviders(<FormLogin />);

    await fireEvent.press(getByText('Aceptar'));

    expect(clearError).toHaveBeenCalledTimes(1);
  });
});

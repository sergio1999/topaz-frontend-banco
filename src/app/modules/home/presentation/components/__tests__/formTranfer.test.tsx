import { fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Keyboard } from 'react-native';

import { ROUTES } from '@/app/(pages)/routes';
import { renderWithProviders } from '@/test-utils/render';

import { useHomeStore } from '../../../application/store';
import { useCaseTransfer } from '../../../application/useCaseTransfer';
import FormTranfer from '../formTranfer';

jest.mock('expo-router', () => ({
  router: { navigate: jest.fn() },
}));

jest.mock('../../../application/useCaseTransfer', () => ({
  useCaseTransfer: jest.fn(),
}));

const transfer = jest.fn();
const clearError = jest.fn();
const clearSuccess = jest.fn();

const mockUseCase = (messages: { errorMessage?: string | null; successMessage?: string | null } = {}) =>
  (useCaseTransfer as jest.Mock).mockReturnValue({
    transfer,
    errorMessage: messages.errorMessage ?? null,
    successMessage: messages.successMessage ?? null,
    clearError,
    clearSuccess,
  });

const fill = async (
  utils: Awaited<ReturnType<typeof renderWithProviders>>,
  value: string,
  document: string,
) => {
  await fireEvent.changeText(utils.getByPlaceholderText('0.00'), value);
  await fireEvent.changeText(utils.getByPlaceholderText('Documento del destinatario'), document);
};

describe('FormTranfer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase();
    transfer.mockResolvedValue(true);
    useHomeStore.setState({ currency: 'BRL', accountBalance: 1500.5 });
  });

  it('muestra los campos valor, moneda y documento', async () => {
    const { getByText, getByPlaceholderText } = await renderWithProviders(<FormTranfer />);

    expect(getByText('Valor')).toBeTruthy();
    expect(getByPlaceholderText('0.00')).toBeTruthy();
    expect(getByPlaceholderText('Documento del destinatario')).toBeTruthy();
    expect(getByText('Transferir')).toBeTruthy();
  });

  it('muestra la moneda del store en el select', async () => {
    const { getByDisplayValue } = await renderWithProviders(<FormTranfer />);
    expect(getByDisplayValue('BRL')).toBeTruthy();
  });

  it('usa USD por defecto si el store no tiene moneda', async () => {
    useHomeStore.setState({ currency: null });
    const { getByDisplayValue } = await renderWithProviders(<FormTranfer />);
    expect(getByDisplayValue('USD')).toBeTruthy();
  });

  it('no permite transferir mientras los campos estén vacíos', async () => {
    const { getByText } = await renderWithProviders(<FormTranfer />);

    await fireEvent.press(getByText('Transferir'));

    expect(transfer).not.toHaveBeenCalled();
  });

  it('no permite transferir si solo se llenó el valor', async () => {
    const utils = await renderWithProviders(<FormTranfer />);

    await fireEvent.changeText(utils.getByPlaceholderText('0.00'), '100');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(transfer).not.toHaveBeenCalled();
  });

  it('ignora caracteres que no sean números en el valor', async () => {
    const { getByPlaceholderText } = await renderWithProviders(<FormTranfer />);

    await fireEvent.changeText(getByPlaceholderText('0.00'), 'abc');

    expect(getByPlaceholderText('0.00').props.value).toBe('');
  });

  it('no acepta más de 2 decimales', async () => {
    const { getByPlaceholderText } = await renderWithProviders(<FormTranfer />);

    await fireEvent.changeText(getByPlaceholderText('0.00'), '10.5');
    await fireEvent.changeText(getByPlaceholderText('0.00'), '10.555');

    expect(getByPlaceholderText('0.00').props.value).toBe('10.5');
  });

  it('muestra error si el valor es 0', async () => {
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '0', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(utils.getByText('El valor debe ser mayor a 0')).toBeTruthy();
    expect(transfer).not.toHaveBeenCalled();
  });

  it('muestra error si el valor supera el saldo disponible', async () => {
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '2000', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(utils.getByText('El valor supera el saldo disponible')).toBeTruthy();
    expect(transfer).not.toHaveBeenCalled();
  });

  it('no valida el saldo si aún no se cargó', async () => {
    useHomeStore.setState({ accountBalance: null });
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '2000', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(transfer).toHaveBeenCalledTimes(1);
  });

  it('el mensaje de error del valor desaparece al corregirlo', async () => {
    const utils = await renderWithProviders(<FormTranfer />);
    await fill(utils, '0', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));
    expect(utils.getByText('El valor debe ser mayor a 0')).toBeTruthy();

    await fireEvent.changeText(utils.getByPlaceholderText('0.00'), '10');

    expect(utils.queryByText('El valor debe ser mayor a 0')).toBeNull();
  });

  it('acepta coma como separador decimal', async () => {
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '10,5', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(transfer).toHaveBeenCalledWith({
      value: 10.5,
      currency: 'BRL',
      payeerDocument: '12345678900',
    });
  });

  it('transfiere con valor, moneda y documento sin espacios y cierra el teclado', async () => {
    const dismiss = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '100', '  12345678900  ');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(dismiss).toHaveBeenCalled();
    expect(transfer).toHaveBeenCalledWith({
      value: 100,
      currency: 'BRL',
      payeerDocument: '12345678900',
    });
  });

  it('limpia los campos cuando la transferencia es exitosa', async () => {
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '100', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(utils.getByPlaceholderText('0.00').props.value).toBe('');
    expect(utils.getByPlaceholderText('Documento del destinatario').props.value).toBe('');
  });

  it('conserva los campos cuando la transferencia falla', async () => {
    transfer.mockResolvedValue(false);
    const utils = await renderWithProviders(<FormTranfer />);

    await fill(utils, '100', '12345678900');
    await fireEvent.press(utils.getByText('Transferir'));

    expect(utils.getByPlaceholderText('0.00').props.value).toBe('100');
    expect(utils.getByPlaceholderText('Documento del destinatario').props.value).toBe('12345678900');
  });

  it('muestra la alerta de error y la cierra con clearError', async () => {
    mockUseCase({ errorMessage: 'Saldo insuficiente' });
    const { getByText } = await renderWithProviders(<FormTranfer />);

    expect(getByText('Saldo insuficiente')).toBeTruthy();
    await fireEvent.press(getByText('Aceptar'));

    expect(clearError).toHaveBeenCalledTimes(1);
  });

  it('al aceptar la alerta de éxito limpia el mensaje y redirige a /home', async () => {
    mockUseCase({ successMessage: 'Transferencia realizada con éxito' });
    const { getByText } = await renderWithProviders(<FormTranfer />);

    expect(getByText('Transferencia realizada con éxito')).toBeTruthy();
    await fireEvent.press(getByText('Aceptar'));

    expect(clearSuccess).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(ROUTES.HOME);
  });
});

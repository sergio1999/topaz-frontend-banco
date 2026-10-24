import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '@/test-utils/render';

import { useCaseMovements } from '../../../application/useCaseMovements';
import MovementsPage from '../movements';

jest.mock('../../../application/useCaseMovements', () => ({
  useCaseMovements: jest.fn(),
}));

jest.mock('react-native-paper-dates', () => ({
  DatePickerModal: () => null,
}));

const fetchTransfers = jest.fn();
const clearError = jest.fn();

const TRANSFERS = [
  {
    value: 250,
    date: '2026-03-20',
    currency: 'BRL',
    payeer: { document: '98765432100', name: 'Ana Pérez' },
  },
  {
    value: 80.5,
    date: '2026-03-21',
    currency: 'BRL',
    payeer: { document: '11122233344', name: 'Luis Gómez' },
  },
];

const setFilters = jest.fn();

const mockUseCase = (
  overrides: {
    transfers?: typeof TRANSFERS;
    filteredTransfers?: typeof TRANSFERS;
    errorMessage?: string | null;
  } = {},
) =>
  (useCaseMovements as jest.Mock).mockReturnValue({
    transfers: overrides.transfers ?? [],
    filteredTransfers: overrides.filteredTransfers ?? overrides.transfers ?? [],
    filters: { payeer: '', value: '', date: null },
    setFilters,
    errorMessage: overrides.errorMessage ?? null,
    fetchTransfers,
    clearError,
  });

describe('MovementsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase();
  });

  it('pide los movimientos al entrar', async () => {
    await renderWithProviders(<MovementsPage />);
    expect(fetchTransfers).toHaveBeenCalledTimes(1);
  });

  it('muestra una fila por cada transferencia', async () => {
    mockUseCase({ transfers: TRANSFERS });
    const { getByText } = await renderWithProviders(<MovementsPage />);

    expect(getByText('Ana Pérez')).toBeTruthy();
    expect(getByText('Luis Gómez')).toBeTruthy();
    expect(getByText('2026-03-20 · 98765432100')).toBeTruthy();
  });

  it('no muestra filas cuando la lista está vacía', async () => {
    const { queryByText } = await renderWithProviders(<MovementsPage />);
    expect(queryByText('Ana Pérez')).toBeNull();
  });

  it('muestra los campos de filtro', async () => {
    const { getAllByText } = await renderWithProviders(<MovementsPage />);

    expect(getAllByText('Destinatario').length).toBeGreaterThan(0);
    expect(getAllByText('Valor').length).toBeGreaterThan(0);
    expect(getAllByText('Fecha').length).toBeGreaterThan(0);
  });

  it('muestra solo las transferencias filtradas', async () => {
    mockUseCase({ transfers: TRANSFERS, filteredTransfers: [TRANSFERS[1]] });
    const { getByText, queryByText } = await renderWithProviders(<MovementsPage />);

    expect(getByText('Luis Gómez')).toBeTruthy();
    expect(queryByText('Ana Pérez')).toBeNull();
  });

  it('muestra un mensaje cuando los filtros no coinciden con ningún movimiento', async () => {
    mockUseCase({ transfers: TRANSFERS, filteredTransfers: [] });
    const { getByText } = await renderWithProviders(<MovementsPage />);

    expect(getByText('No hay movimientos que coincidan con los filtros')).toBeTruthy();
  });

  it('no muestra el mensaje de sin coincidencias si aún no hay movimientos', async () => {
    const { queryByText } = await renderWithProviders(<MovementsPage />);

    expect(queryByText('No hay movimientos que coincidan con los filtros')).toBeNull();
  });

  it('actualiza los filtros al escribir en un campo', async () => {
    const { getByPlaceholderText } = await renderWithProviders(<MovementsPage />);

    await fireEvent.changeText(getByPlaceholderText('Nombre o documento'), 'Ana');

    expect(setFilters).toHaveBeenCalledWith({ payeer: 'Ana', value: '', date: null });
  });

  it('muestra la alerta de error y la cierra con clearError', async () => {
    mockUseCase({ errorMessage: 'Sin conexión' });
    const { getByText } = await renderWithProviders(<MovementsPage />);

    expect(getByText('Sin conexión')).toBeTruthy();
    await fireEvent.press(getByText('Aceptar'));

    expect(clearError).toHaveBeenCalledTimes(1);
  });
});

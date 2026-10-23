import { fireEvent } from '@testing-library/react-native';

import { renderWithProviders } from '@/test-utils/render';

import { useCaseMovements } from '../../../application/useCaseMovements';
import MovementsPage from '../movements';

jest.mock('../../../application/useCaseMovements', () => ({
  useCaseMovements: jest.fn(),
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

const mockUseCase = (
  overrides: { transfers?: typeof TRANSFERS; errorMessage?: string | null } = {},
) =>
  (useCaseMovements as jest.Mock).mockReturnValue({
    transfers: overrides.transfers ?? [],
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

  it('muestra el título', async () => {
    const { getByText } = await renderWithProviders(<MovementsPage />);
    expect(getByText('Movimientos')).toBeTruthy();
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

  it('muestra la alerta de error y la cierra con clearError', async () => {
    mockUseCase({ errorMessage: 'Sin conexión' });
    const { getByText } = await renderWithProviders(<MovementsPage />);

    expect(getByText('Sin conexión')).toBeTruthy();
    await fireEvent.press(getByText('Aceptar'));

    expect(clearError).toHaveBeenCalledTimes(1);
  });
});

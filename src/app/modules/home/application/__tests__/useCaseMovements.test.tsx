import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '@/app/modules/auth/application/store';
import { useAppStore } from '@/app/store';

import { EMPTY_MOVEMENT_FILTERS } from '../../domain/i.tranfer';
import { getTransferListService } from '../../infrastructure/apiServices';
import { useCaseMovements } from '../useCaseMovements';

jest.mock('../../infrastructure/apiServices', () => ({
  getTransferListService: jest.fn(),
}));

const USER = { id: 1, name: 'Sergio', email: 'a@a.com' };
const TRANSFERS = [
  {
    value: 250,
    date: '2026-03-20',
    currency: 'BRL',
    payeer: { document: '98765432100', name: 'Destinatario' },
  },
];

describe('useCaseMovements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ token: 'abc123', user: USER, isAuthenticated: true });
    useAppStore.setState({ isLoading: false, loadingMessage: undefined });
  });

  it('inicia con la lista vacía y sin error', async () => {
    const { result } = await renderHook(() => useCaseMovements());

    expect(result.current.transfers).toEqual([]);
    expect(result.current.errorMessage).toBeNull();
  });

  it('no consulta si no hay token', async () => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    const { result } = await renderHook(() => useCaseMovements());

    await act(async () => {
      await result.current.fetchTransfers();
    });

    expect(getTransferListService).not.toHaveBeenCalled();
  });

  it('guarda las transferencias de la respuesta', async () => {
    (getTransferListService as jest.Mock).mockResolvedValue({
      mesage: 'ok',
      transfers: TRANSFERS,
    });
    const { result } = await renderHook(() => useCaseMovements());

    await act(async () => {
      await result.current.fetchTransfers();
    });

    expect(getTransferListService).toHaveBeenCalledWith('abc123');
    expect(result.current.transfers).toEqual(TRANSFERS);
  });

  it('muestra el loader mientras consulta y lo oculta al terminar', async () => {
    let resolveList: (value: unknown) => void = () => {};
    (getTransferListService as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveList = resolve;
      }),
    );
    const { result } = await renderHook(() => useCaseMovements());

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.fetchTransfers();
    });
    expect(useAppStore.getState().isLoading).toBe(true);
    expect(useAppStore.getState().loadingMessage).toBe('Consultando movimientos...');

    await act(async () => {
      resolveList({ mesage: 'ok', transfers: [] });
      await pending;
    });
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('guarda el mensaje de error cuando el servicio falla', async () => {
    (getTransferListService as jest.Mock).mockRejectedValue({ message: 'Sin conexión' });
    const { result } = await renderHook(() => useCaseMovements());

    await act(async () => {
      await result.current.fetchTransfers();
    });

    expect(result.current.errorMessage).toBe('Sin conexión');
    expect(result.current.transfers).toEqual([]);
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('usa un mensaje por defecto si el error no trae mensaje', async () => {
    (getTransferListService as jest.Mock).mockRejectedValue({});
    const { result } = await renderHook(() => useCaseMovements());

    await act(async () => {
      await result.current.fetchTransfers();
    });

    expect(result.current.errorMessage).toBe('No se pudieron consultar los movimientos');
  });

  it('clearError limpia el mensaje de error', async () => {
    (getTransferListService as jest.Mock).mockRejectedValue({ message: 'Error' });
    const { result } = await renderHook(() => useCaseMovements());
    await act(async () => {
      await result.current.fetchTransfers();
    });

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.errorMessage).toBeNull();
  });

  describe('filtros', () => {
    const LIST = [
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
      {
        value: 250,
        date: '2026-03-21',
        currency: 'BRL',
        payeer: { document: '55566677788', name: 'Ana Torres' },
      },
    ];

    const loadList = async () => {
      (getTransferListService as jest.Mock).mockResolvedValue({ mesage: 'ok', transfers: LIST });
      const hook = await renderHook(() => useCaseMovements());
      await act(async () => {
        await hook.result.current.fetchTransfers();
      });
      return hook;
    };

    it('inicia sin filtros y devuelve todas las transferencias', async () => {
      const { result } = await loadList();

      expect(result.current.filters).toEqual(EMPTY_MOVEMENT_FILTERS);
      expect(result.current.filteredTransfers).toEqual(LIST);
    });

    it('filtra por nombre del destinatario sin distinguir mayúsculas', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, payeer: 'ANA' });
      });

      expect(result.current.filteredTransfers.map((t) => t.payeer.name)).toEqual([
        'Ana Pérez',
        'Ana Torres',
      ]);
    });

    it('filtra por documento del destinatario', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, payeer: '1112223' });
      });

      expect(result.current.filteredTransfers.map((t) => t.payeer.name)).toEqual(['Luis Gómez']);
    });

    it('filtra por valor exacto', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, value: '250' });
      });

      expect(result.current.filteredTransfers).toHaveLength(2);
    });

    it('acepta coma como separador decimal en el valor', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, value: '80,5' });
      });

      expect(result.current.filteredTransfers.map((t) => t.payeer.name)).toEqual(['Luis Gómez']);
    });

    it('ignora un valor que no es numérico', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, value: '.' });
      });

      expect(result.current.filteredTransfers).toHaveLength(3);
    });

    it('filtra por fecha', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, date: new Date(2026, 2, 21) });
      });

      expect(result.current.filteredTransfers.map((t) => t.payeer.name)).toEqual([
        'Luis Gómez',
        'Ana Torres',
      ]);
    });

    it('combina los filtros', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ payeer: 'ana', value: '250', date: new Date(2026, 2, 21) });
      });

      expect(result.current.filteredTransfers.map((t) => t.payeer.name)).toEqual(['Ana Torres']);
    });

    it('devuelve una lista vacía si nada coincide, sin perder las transferencias originales', async () => {
      const { result } = await loadList();

      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, payeer: 'zzz' });
      });

      expect(result.current.filteredTransfers).toEqual([]);
      expect(result.current.transfers).toEqual(LIST);
    });

    it('al restablecer los filtros vuelve a mostrar todo', async () => {
      const { result } = await loadList();
      await act(async () => {
        result.current.setFilters({ ...EMPTY_MOVEMENT_FILTERS, payeer: 'zzz' });
      });

      await act(async () => {
        result.current.setFilters(EMPTY_MOVEMENT_FILTERS);
      });

      expect(result.current.filteredTransfers).toEqual(LIST);
    });
  });
});

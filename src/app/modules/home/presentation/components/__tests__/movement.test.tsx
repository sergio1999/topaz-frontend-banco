import { renderWithProviders } from '@/test-utils/render';

import Movement from '../movement';

const TRANSFER = {
  value: 250,
  date: '2026-03-20',
  currency: 'BRL',
  payeer: { document: '98765432100', name: 'Nombre del Destinatario' },
};

describe('Movement', () => {
  it('muestra el nombre del destinatario', async () => {
    const { getByText } = await renderWithProviders(<Movement transfer={TRANSFER} />);
    expect(getByText('Nombre del Destinatario')).toBeTruthy();
  });

  it('muestra la fecha y el documento', async () => {
    const { getByText } = await renderWithProviders(<Movement transfer={TRANSFER} />);
    expect(getByText('2026-03-20 · 98765432100')).toBeTruthy();
  });

  it('muestra el monto formateado', async () => {
    const { getByText } = await renderWithProviders(<Movement transfer={TRANSFER} />);
    expect(getByText(/250,00/)).toBeTruthy();
  });
});

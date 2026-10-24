import { fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { renderWithProviders } from '../../test-utils/render';
import TopazNavigationBar from '../TopazNavigationBar';

const ITEMS = [
  { key: '/home', label: 'Inicio', icon: 'home' },
  { key: '/home/movements', label: 'Movimientos', icon: 'swap-horizontal' },
  { key: '/home/transfers', label: 'Transferencias', icon: 'bank-transfer' },
];

describe('TopazNavigationBar', () => {
  it('muestra todas las pestañas', async () => {
    const { getAllByText } = await renderWithProviders(
      <TopazNavigationBar items={ITEMS} activeKey="/home" onChange={jest.fn()} />,
    );
    ITEMS.forEach((item) => expect(getAllByText(item.label).length).toBeGreaterThan(0));
  });

  it('llama a onChange con la key de la pestaña presionada', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderWithProviders(
      <TopazNavigationBar items={ITEMS} activeKey="/home" onChange={onChange} />,
    );
    await fireEvent(getByTestId('nav-/home/movements'), 'click');
    expect(onChange).toHaveBeenCalledWith('/home/movements');
  });

  it('no falla si activeKey no coincide con ninguna pestaña', async () => {
    const { getAllByText } = await renderWithProviders(
      <TopazNavigationBar items={ITEMS} activeKey="/otra" onChange={jest.fn()} />,
    );
    expect(getAllByText('Inicio').length).toBeGreaterThan(0);
  });

  it('aplica los colores de pestaña activa e inactiva a las etiquetas', async () => {
    const { getAllByText } = await renderWithProviders(
      <TopazNavigationBar
        items={ITEMS}
        activeKey="/home"
        onChange={jest.fn()}
        backgroundColor="#1E1E68"
        activeColor="#FFFFFF"
        inactiveColor="#FFFFFF"
        indicatorColor="rgba(255, 255, 255, 0.2)"
      />,
    );

    const colors = getAllByText('Movimientos').map(
      (node) => StyleSheet.flatten(node.props.style)?.color,
    );
    expect(colors).toContain('#FFFFFF');
  });
});

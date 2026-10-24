import { Href, router, usePathname } from 'expo-router';

import TopazNavigationBar, { TopazNavigationItem } from '@/components/TopazNavigationBar';

import { ROUTES } from '../../../../(pages)/routes';

export const HOME_NAV_ITEMS: TopazNavigationItem[] = [
  { key: ROUTES.HOME, label: 'Inicio', icon: 'home' },
  { key: ROUTES.HOME_MOVEMENTS, label: 'Movimientos', icon: 'swap-horizontal' },
  { key: ROUTES.HOME_TRANSFERS, label: 'Transferencias', icon: 'bank-transfer' },
];

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <TopazNavigationBar
      items={HOME_NAV_ITEMS}
      activeKey={pathname}
      onChange={(route) => router.navigate(route as Href)}
      backgroundColor="#1E1E68"
      activeColor="#FFFFFF"
      inactiveColor="#FFFFFF"
      indicatorColor="rgba(255, 255, 255, 0.2)"
    />
  );
}

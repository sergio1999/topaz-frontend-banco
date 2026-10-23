import { BottomNavigation, Icon } from 'react-native-paper';

export interface TopazNavigationItem {
  key: string;
  label: string;
  icon: string;
}

export interface TopazNavigationBarProps {
  items: TopazNavigationItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function TopazNavigationBar({ items, activeKey, onChange }: TopazNavigationBarProps) {
  const index = Math.max(
    0,
    items.findIndex((item) => item.key === activeKey),
  );

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes: items }}
      onTabPress={({ route }) => onChange(route.key)}
      renderIcon={({ route, color }) => <Icon source={route.icon} size={24} color={color} />}
      getLabelText={({ route }) => route.label}
    />
  );
}

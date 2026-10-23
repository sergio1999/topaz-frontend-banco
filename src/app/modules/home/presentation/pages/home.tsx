import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TopazNavigationBar, { TopazNavigationItem } from '@/components/TopazNavigationBar';
import TopazText from '@/components/TopazText';
import TopazTopAppBar from '@/components/TopazTopAppBar';

import { useAuthStore } from '../../../auth/application/store';

const NAV_ITEMS: TopazNavigationItem[] = [
  { key: 'home', label: 'Inicio', icon: 'home' },
  { key: 'accounts', label: 'Cuentas', icon: 'bank' },
  { key: 'profile', label: 'Perfil', icon: 'account' },
];

export default function HomePage() {
  const [activeKey, setActiveKey] = useState('home');
  const clearSession = useAuthStore((state) => state.clearSession);
  const activeItem = NAV_ITEMS.find((item) => item.key === activeKey);

  return (
    <View style={styles.container}>
      <TopazTopAppBar
        title="Topaz"
        actions={[{ icon: 'logout', onPress: clearSession, accessibilityLabel: 'Cerrar sesión' }]}
      />

      <View style={styles.content}>
        <TopazText variant="titleLarge">{activeItem?.label}</TopazText>
      </View>

      <TopazNavigationBar items={NAV_ITEMS} activeKey={activeKey} onChange={setActiveKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

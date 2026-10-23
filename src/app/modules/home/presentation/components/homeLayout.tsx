import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAuthStore } from '../../../auth/application/store';
import HeaderBar from './headerBar';
import NavigationBar from './navigationBar';

export default function HomeLayout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <View style={styles.container}>
      <HeaderBar onLogout={clearSession} />
      <View style={styles.content}>
        <Slot />
      </View>
      <NavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

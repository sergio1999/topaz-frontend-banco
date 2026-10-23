import { StyleSheet, View } from 'react-native';

import TopazText from '@/components/TopazText';

export default function MovementsPage() {
  return (
    <View style={styles.container}>
      <TopazText variant="titleLarge">Movimientos</TopazText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

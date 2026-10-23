import { StyleSheet, View } from 'react-native';

import TopazText from '@/components/TopazText';

export default function TransfersPage() {
  return (
    <View style={styles.container}>
      <TopazText variant="titleLarge">Transferencias</TopazText>
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

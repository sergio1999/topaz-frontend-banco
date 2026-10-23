import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export interface TopazLoadingProps {
  visible: boolean;
  message?: string;
}

export default function TopazLoading({ visible, message }: TopazLoadingProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  message: {
    textAlign: 'center',
  },
});

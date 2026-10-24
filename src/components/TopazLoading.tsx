import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

// Punto medio del degradado #92FE9D -> #00C9FF (ActivityIndicator solo admite un color).
const SPINNER_COLOR = '#49E4CE';

export interface TopazLoadingProps {
  visible: boolean;
  message?: string;
}

export default function TopazLoading({ visible, message }: TopazLoadingProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={SPINNER_COLOR} />
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

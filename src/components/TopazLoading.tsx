import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Modal, Portal, Text } from 'react-native-paper';

export interface TopazLoadingProps {
  visible: boolean;
  message?: string;
}

export default function TopazLoading({ visible, message }: TopazLoadingProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        dismissableBackButton={false}
        contentContainerStyle={styles.content}>
        <View style={styles.box}>
          <ActivityIndicator size="large" />
          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    minWidth: 120,
  },
  message: {
    textAlign: 'center',
  },
});

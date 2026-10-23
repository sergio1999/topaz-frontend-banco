import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

export interface TopazModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  dismissable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function TopazModal({
  visible,
  onDismiss,
  children,
  dismissable = true,
  contentStyle,
}: TopazModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        contentContainerStyle={[styles.content, contentStyle]}>
        {children}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
  },
});

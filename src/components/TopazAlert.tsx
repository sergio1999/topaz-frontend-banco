import { Button, Dialog, Portal, Text } from 'react-native-paper';

export interface TopazAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export default function TopazAlert({
  visible,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel,
  onConfirm,
  onCancel,
  onDismiss,
}: TopazAlertProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss ?? onCancel ?? onConfirm}>
        {!!title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {!!cancelLabel && <Button onPress={onCancel}>{cancelLabel}</Button>}
          <Button onPress={onConfirm}>{confirmLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

import TopazText from '@/components/TopazText';

import { ITransfer } from '../../domain/i.tranfer';

interface MovementProps {
  transfer: ITransfer;
}

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);

export default function Movement({ transfer }: MovementProps) {
  return (
    <List.Item
      title={transfer.payeer.name}
      description={`${transfer.date} · ${transfer.payeer.document}`}
      right={() => (
        <TopazText variant="titleMedium" style={styles.amount}>
          {formatAmount(transfer.value, transfer.currency)}
        </TopazText>
      )}
    />
  );
}

const styles = StyleSheet.create({
  amount: {
    alignSelf: 'center',
  },
});

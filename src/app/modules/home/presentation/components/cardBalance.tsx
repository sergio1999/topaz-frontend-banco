import { StyleSheet, View } from 'react-native';

import TopazText from '@/components/TopazText';

import { useHomeStore } from '../../application/store';

const formatBalance = (amount: number, currency: string) =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);

export default function CardBalance() {
  const accountBalance = useHomeStore((state) => state.accountBalance);
  const currency = useHomeStore((state) => state.currency);
  return (
    <View style={styles.container}>
      <TopazText variant="titleMedium">Saldo disponible</TopazText>
      {accountBalance !== null && currency && (
        <TopazText variant="displaySmall" style={styles.balance}>
          {formatBalance(accountBalance, currency)}
        </TopazText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  balance: {
    fontWeight: '700',
  },
});

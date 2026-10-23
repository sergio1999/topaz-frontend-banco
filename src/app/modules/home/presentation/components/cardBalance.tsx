import { StyleSheet, View } from 'react-native';

import TopazText from '@/components/TopazText';

import { IBalanceResponse } from '../../domain/i.balance';

interface CardBalanceProps {
  balance: IBalanceResponse | null;
}

const formatBalance = (amount: number, currency: string) =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);

export default function CardBalance({ balance }: CardBalanceProps) {
  return (
    <View style={styles.container}>
      <TopazText variant="titleMedium">Saldo disponible</TopazText>
      {balance && (
        <TopazText variant="displaySmall" style={styles.balance}>
          {formatBalance(balance.accountBalance, balance.currency)}
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

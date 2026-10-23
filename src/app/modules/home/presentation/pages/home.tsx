import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';

import { useCaseBalance } from '../../application/useCaseBalance';
import CardBalance from '../components/cardBalance';

export default function HomePage() {
  const { balance, errorMessage, fetchBalance, clearError } = useCaseBalance();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <View style={styles.container}>
      <CardBalance balance={balance} />

      <TopazAlert
        visible={errorMessage !== null}
        title="Error"
        message={errorMessage ?? ''}
        onConfirm={clearError}
      />
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

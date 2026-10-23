import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';

import { useHomeStore } from '../../application/store';
import { useCaseBalance } from '../../application/useCaseBalance';
import CardBalance from '../components/cardBalance';

export default function HomePage() {
  const { errorMessage, fetchBalance, clearError } = useCaseBalance();

  const accountBalance = useHomeStore((state) => state.accountBalance);

  useEffect(() => {
    if (accountBalance === null) fetchBalance();
  }, [accountBalance, fetchBalance]);

  return (
    <View style={styles.container}>
      <CardBalance />

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

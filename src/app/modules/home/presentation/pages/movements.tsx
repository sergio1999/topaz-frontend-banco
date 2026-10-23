import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';
import TopazText from '@/components/TopazText';

import { useCaseMovements } from '../../application/useCaseMovements';
import Movement from '../components/movement';

export default function MovementsPage() {
  const { transfers, errorMessage, fetchTransfers, clearError } = useCaseMovements();

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <View style={styles.container}>
      <FlatList
        data={transfers}
        keyExtractor={(item, index) => `${item.payeer.document}-${item.date}-${index}`}
        ListHeaderComponent={<TopazText variant="titleLarge" style={styles.title}>Movimientos</TopazText>}
        renderItem={({ item }) => <Movement transfer={item} />}
      />

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
  },
  title: {
    padding: 16,
  },
});

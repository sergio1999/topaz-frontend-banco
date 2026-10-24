import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';
import TopazText from '@/components/TopazText';

import { useCaseMovements } from '../../application/useCaseMovements';
import FilterMovements from '../components/filterMovements';
import Movement from '../components/movement';

export default function MovementsPage() {
  const { transfers, filteredTransfers, filters, setFilters, errorMessage, fetchTransfers, clearError } =
    useCaseMovements();

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransfers}
        keyExtractor={(item, index) => `${item.payeer.document}-${item.date}-${index}`}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <FilterMovements filters={filters} onChange={setFilters} />
          </View>
        }
        ListEmptyComponent={
          transfers.length > 0 ? (
            <TopazText style={styles.empty}>No hay movimientos que coincidan con los filtros</TopazText>
          ) : undefined
        }
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
  empty: {
    textAlign: 'center',
    padding: 16,
  },
});

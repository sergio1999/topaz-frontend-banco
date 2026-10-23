import { StyleSheet, View } from 'react-native';

import TopazButton from '@/components/TopazButton';
import TopazInput from '@/components/TopazInput';
import TopazSelectDate from '@/components/TopazSelectDate';

import { EMPTY_MOVEMENT_FILTERS, IMovementFilters } from '../../domain/i.tranfer';

const VALUE_INPUT_REGEX = /^\d*([.,]\d{0,2})?$/;

interface FilterMovementsProps {
  filters: IMovementFilters;
  onChange: (filters: IMovementFilters) => void;
}

export default function FilterMovements({ filters, onChange }: FilterMovementsProps) {
  const hasFilters = filters.payeer !== '' || filters.value !== '' || filters.date !== null;

  const handleValueChange = (value: string) => {
    if (!VALUE_INPUT_REGEX.test(value)) return;
    onChange({ ...filters, value });
  };

  return (
    <View style={styles.container}>
      <TopazInput
        label="Destinatario"
        value={filters.payeer}
        onChangeText={(payeer) => onChange({ ...filters, payeer })}
        placeholder="Nombre o documento"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.row}>
        <TopazInput
          label="Valor"
          value={filters.value}
          onChangeText={handleValueChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
          containerStyle={styles.field}
        />

        <TopazSelectDate
          label="Fecha"
          value={filters.date}
          onChange={(date) => onChange({ ...filters, date })}
          style={styles.field}
        />
      </View>

      {hasFilters && (
        <TopazButton
          label="Limpiar filtros"
          mode="text"
          onPress={() => onChange(EMPTY_MOVEMENT_FILTERS)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  field: {
    flex: 1,
  },
});

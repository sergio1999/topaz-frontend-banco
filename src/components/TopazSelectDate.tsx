import { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

import { standardInputProps } from './topazInputStyle';

export interface TopazSelectDateProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  locale?: string;
  error?: string;
  disabled?: boolean;
  validRange?: { startDate?: Date; endDate?: Date };
  style?: StyleProp<ViewStyle>;
}

const formatDate = (date?: Date | null) =>
  date
    ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
    : '';

export default function TopazSelectDate({
  label,
  value,
  onChange,
  locale = 'es',
  error,
  disabled,
  validRange,
  style,
}: TopazSelectDateProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={style}>
      <TextInput
        {...standardInputProps}
        label={label}
        value={formatDate(value)}
        placeholder="DD/MM/AAAA"
        editable={false}
        disabled={disabled}
        error={!!error}
        right={<TextInput.Icon icon="calendar" onPress={() => !disabled && setVisible(true)} />}
        onPressIn={() => !disabled && setVisible(true)}
      />
      {!!error && <HelperText type="error">{error}</HelperText>}
      <DatePickerModal
        locale={locale}
        mode="single"
        visible={visible}
        date={value ?? undefined}
        validRange={validRange}
        onDismiss={() => setVisible(false)}
        onConfirm={({ date }) => {
          setVisible(false);
          onChange(date ?? null);
        }}
      />
    </View>
  );
}

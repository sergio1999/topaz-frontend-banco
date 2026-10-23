import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

export interface TopazInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function TopazInput({
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}: TopazInputProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor="#8E8E93"
        {...inputProps}
        style={[styles.input, error && styles.inputError, style]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#D92D20',
  },
  error: {
    color: '#D92D20',
    fontSize: 13,
  },
});

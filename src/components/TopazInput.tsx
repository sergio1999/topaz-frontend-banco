import { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

type PaperInputProps = Omit<ComponentProps<typeof TextInput>, 'error' | 'ref' | 'mode'>;

export interface TopazInputProps extends PaperInputProps {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function TopazInput({ error, containerStyle, ...inputProps }: TopazInputProps) {
  return (
    <View style={containerStyle}>
      <TextInput mode="outlined" error={!!error} {...inputProps} />
      {!!error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

import { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { standardInputProps } from './topazInputStyle';

type PaperInputProps = Omit<ComponentProps<typeof TextInput>, 'error' | 'ref' | 'mode'>;

export interface TopazInputProps extends PaperInputProps {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function TopazInput({ error, containerStyle, style, ...inputProps }: TopazInputProps) {
  return (
    <View style={containerStyle}>
      <TextInput
        {...standardInputProps}
        error={!!error}
        {...inputProps}
        style={[standardInputProps.style, style]}
      />
      {!!error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

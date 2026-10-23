import { ComponentProps } from 'react';
import { Text } from 'react-native-paper';

export type TopazTextProps = Omit<ComponentProps<typeof Text>, 'ref'>;

export default function TopazText({ variant = 'bodyMedium', ...textProps }: TopazTextProps) {
  return <Text variant={variant} {...textProps} />;
}

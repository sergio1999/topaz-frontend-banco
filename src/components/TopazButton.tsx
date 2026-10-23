import { Button, ButtonProps } from 'react-native-paper';

export type TopazButtonProps = Omit<ButtonProps, 'children'> & {
  label: string;
};

export default function TopazButton({ label, mode = 'contained', ...buttonProps }: TopazButtonProps) {
  return (
    <Button mode={mode} {...buttonProps}>
      {label}
    </Button>
  );
}

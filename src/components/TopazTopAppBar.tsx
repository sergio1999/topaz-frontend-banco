import { Appbar } from 'react-native-paper';

export interface TopazTopAppBarAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface TopazTopAppBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: TopazTopAppBarAction[];
}

export default function TopazTopAppBar({ title, subtitle, onBack, actions = [] }: TopazTopAppBarProps) {
  return (
    <Appbar.Header>
      {onBack && <Appbar.BackAction onPress={onBack} />}
      <Appbar.Content title={title} subtitle={subtitle} />
      {actions.map((action) => (
        <Appbar.Action
          key={action.icon}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
}

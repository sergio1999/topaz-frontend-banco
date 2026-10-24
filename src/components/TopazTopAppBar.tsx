import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
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
  backgroundColor?: string;
  color?: string;
  logo?: ImageSourcePropType;
}

export default function TopazTopAppBar({
  title,
  subtitle,
  onBack,
  actions = [],
  backgroundColor,
  color,
  logo,
}: TopazTopAppBarProps) {
  return (
    <Appbar.Header style={backgroundColor ? { backgroundColor } : undefined}>
      {onBack && <Appbar.BackAction onPress={onBack} color={color} />}
      {logo && <Image source={logo} style={styles.logo} accessibilityLabel="Logo" />}
      <Appbar.Content title={title} subtitle={subtitle} color={color} />
      {actions.map((action) => (
        <Appbar.Action
          key={action.icon}
          icon={action.icon}
          color={color}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 36,
    height: 36,
    marginLeft: 12,
  },
});

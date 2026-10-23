import TopazTopAppBar from '@/components/TopazTopAppBar';

interface HeaderBarProps {
  title?: string;
  onLogout: () => void;
}

export default function HeaderBar({ title = 'Topaz', onLogout }: HeaderBarProps) {
  return (
    <TopazTopAppBar
      title={title}
      actions={[{ icon: 'logout', onPress: onLogout, accessibilityLabel: 'Cerrar sesión' }]}
    />
  );
}

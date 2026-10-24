import TopazTopAppBar from '@/components/TopazTopAppBar';

const LOGO = require('../../../../../../assets/images/splash-icon.png');

interface HeaderBarProps {
  title?: string;
  onLogout: () => void;
}

export default function HeaderBar({ title = 'Topaz', onLogout }: HeaderBarProps) {
  return (
    <TopazTopAppBar
      title={title}
      backgroundColor="#1E1E68"
      color="#FFFFFF"
      logo={LOGO}
      actions={[{ icon: 'logout', onPress: onLogout, accessibilityLabel: 'Cerrar sesión' }]}
    />
  );
}

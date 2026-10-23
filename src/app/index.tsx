import { Redirect } from 'expo-router';

import { ROUTES } from './(pages)/routes';
import { useAuthStore } from './modules/auth/application/store';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Redirect href={isAuthenticated ? ROUTES.HOME : ROUTES.AUTH} />;
}

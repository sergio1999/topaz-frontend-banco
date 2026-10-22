import { Redirect } from 'expo-router';

import { DEFAULT_ROUTE } from './(pages)/routes';

export default function Index() {
  return <Redirect href={DEFAULT_ROUTE} />;
}

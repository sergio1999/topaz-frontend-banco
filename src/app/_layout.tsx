import { Stack } from 'expo-router';

import { useAuthStore } from './modules/auth/application/store';

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(pages)/auth" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(pages)/home" />
      </Stack.Protected>
    </Stack>
  );
}

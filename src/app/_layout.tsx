import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { en, es, registerTranslation } from 'react-native-paper-dates';

import TopazLoading from '@/components/TopazLoading';

import { useAuthStore } from './modules/auth/application/store';
import { useAppStore } from './store';

registerTranslation('es', es);
registerTranslation('en', en);

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingMessage = useAppStore((state) => state.loadingMessage);

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(pages)/auth" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(pages)/home" />
        </Stack.Protected>
      </Stack>
      <TopazLoading visible={isLoading} message={loadingMessage} />
    </PaperProvider>
  );
}

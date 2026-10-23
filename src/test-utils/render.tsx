import { render } from '@testing-library/react-native';
import { ReactElement } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 360, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export async function renderWithProviders(ui: ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <PaperProvider>{ui}</PaperProvider>
    </SafeAreaProvider>,
  );
}

import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import TopazText from '@/components/TopazText';

import FormLogin from '../components/formLogin';

export default function AuthPage() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <TopazText variant="headlineMedium" style={styles.title}>
          Iniciar sesión
        </TopazText>

        <FormLogin />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(246, 249, 252, 1)',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E1E68',
  },
});

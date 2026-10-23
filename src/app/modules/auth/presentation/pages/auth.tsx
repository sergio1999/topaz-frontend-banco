import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import TopazButton from '@/components/TopazButton';
import TopazInput from '@/components/TopazInput';
import TopazText from '@/components/TopazText';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Ingresa un correo válido';
    if (password.length === 0) nextErrors.password = 'Ingresa tu contraseña';
    setErrors(nextErrors);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.form}>
        <TopazText variant="headlineMedium" style={styles.title}>
          Iniciar sesión
        </TopazText>

        <TopazInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          error={errors.email}
        />

        <TopazInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          error={errors.password}
        />

        <TopazButton label="Ingresar" onPress={handleSubmit} style={styles.button} />
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
  },
  form: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';
import TopazButton from '@/components/TopazButton';
import TopazInput from '@/components/TopazInput';

import { useCaseAuth } from '../../application/useCaseAuth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, errorMessage, clearError } = useCaseAuth();

  const isFormComplete = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Ingresa un correo válido';
    if (password.length === 0) nextErrors.password = 'Ingresa tu contraseña';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await login({ email: email.trim(), password });
  };

  return (
    <View style={styles.form}>
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

      <TopazButton
        label="Ingresar"
        buttonColor="#1E1E68"
        onPress={handleSubmit}
        disabled={!isFormComplete}
        style={styles.button}
      />

      <TopazAlert
        visible={errorMessage !== null}
        title="Error"
        message={errorMessage ?? ''}
        onConfirm={clearError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
});

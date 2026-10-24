import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';


import FormTranfer from '../components/formTranfer';

export default function TransfersPage() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <FormTranfer />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
});

import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import TopazAlert from '@/components/TopazAlert';
import TopazButton from '@/components/TopazButton';
import TopazInput from '@/components/TopazInput';
import TopazSelect from '@/components/TopazSelect';

import { ROUTES } from '../../../../(pages)/routes';
import { useHomeStore } from '../../application/store';
import { useCaseTransfer } from '../../application/useCaseTransfer';

const DEFAULT_CURRENCY = 'USD';
const VALUE_INPUT_REGEX = /^\d*([.,]\d{0,2})?$/;

const validateValue = (raw: string, accountBalance: number | null): string | undefined => {
  const amount = Number(raw.replace(',', '.'));
  if (raw.trim().length === 0) return 'Ingresa el valor de la transferencia';
  if (!Number.isFinite(amount)) return 'Ingresa un valor numérico válido';
  if (amount <= 0) return 'El valor debe ser mayor a 0';
  if (accountBalance !== null && amount > accountBalance) return 'El valor supera el saldo disponible';
  return undefined;
};

export default function FormTranfer() {
  const [value, setValue] = useState('');
  const [document, setDocument] = useState('');
  const [valueError, setValueError] = useState<string | undefined>();

  const currency = useHomeStore((state) => state.currency) || DEFAULT_CURRENCY;
  const accountBalance = useHomeStore((state) => state.accountBalance);
  const currencyOptions = [{ label: currency, value: currency }];

  const { transfer, errorMessage, successMessage, clearError, clearSuccess } = useCaseTransfer();

  const isFormComplete = value.trim().length > 0 && document.trim().length > 0;

  const handleValueChange = (text: string) => {
    if (!VALUE_INPUT_REGEX.test(text)) return;
    setValue(text);
    if (valueError) setValueError(undefined);
  };

  const handleSuccessConfirm = () => {
    clearSuccess();
    router.navigate(ROUTES.HOME as Href);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const error = validateValue(value, accountBalance);
    setValueError(error);
    if (error) return;

    const amount = Number(value.replace(',', '.'));
    const success = await transfer({
      value: amount,
      currency,
      payeerDocument: document.trim(),
    });
    if (success) {
      setValue('');
      setDocument('');
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <TopazInput
          label="Valor"
          value={value}
          onChangeText={handleValueChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={valueError}
          containerStyle={styles.valueField}
        />

        <TopazSelect
          label="Moneda"
          options={currencyOptions}
          value={currency}
          onChange={() => {}}
          disabled
          style={styles.currencyField}
        />
      </View>

      <TopazInput
        label="Documento"
        value={document}
        onChangeText={setDocument}
        placeholder="Documento del destinatario"
        keyboardType="number-pad"
      />

      <TopazButton
        label="Transferir"
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
      <TopazAlert
        visible={successMessage !== null}
        title="Listo"
        message={successMessage ?? ''}
        onConfirm={handleSuccessConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueField: {
    flex: 2,
  },
  currencyField: {
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});

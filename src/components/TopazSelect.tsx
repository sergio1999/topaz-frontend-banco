import { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, Menu, TextInput } from 'react-native-paper';

import { standardInputProps } from './topazInputStyle';

export interface TopazSelectOption {
  label: string;
  value: string;
}

export interface TopazSelectProps {
  label?: string;
  options: TopazSelectOption[];
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function TopazSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  style,
}: TopazSelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={style}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            {...standardInputProps}
            label={label}
            placeholder={placeholder}
            value={selected?.label ?? ''}
            editable={false}
            disabled={disabled}
            error={!!error}
            right={<TextInput.Icon icon="menu-down" onPress={() => !disabled && setVisible(true)} />}
            onPressIn={() => !disabled && setVisible(true)}
          />
        }>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => {
              onChange(option.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
      {!!error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

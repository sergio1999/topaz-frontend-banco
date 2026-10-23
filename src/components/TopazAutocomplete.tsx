import { useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, List, Surface, TextInput } from 'react-native-paper';

export interface TopazAutocompleteOption {
  label: string;
  value: string;
}

export interface TopazAutocompleteProps {
  label?: string;
  options: TopazAutocompleteOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxSuggestions?: number;
  style?: StyleProp<ViewStyle>;
}

export default function TopazAutocomplete({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  maxSuggestions = 5,
  style,
}: TopazAutocompleteProps) {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return options
      .filter((option) => option.label.toLowerCase().includes(term))
      .slice(0, maxSuggestions);
  }, [options, query, maxSuggestions]);

  return (
    <View style={style}>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        error={!!error}
        onFocus={() => setOpen(true)}
        onChangeText={(text) => {
          setQuery(text);
          setOpen(true);
          if (value) onChange(null);
        }}
        autoCorrect={false}
      />
      {open && suggestions.length > 0 && (
        <Surface elevation={2}>
          {suggestions.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              onPress={() => {
                setQuery(option.label);
                onChange(option.value);
                setOpen(false);
              }}
            />
          ))}
        </Surface>
      )}
      {!!error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

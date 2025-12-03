import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ProfileInput({
  label,
  placeholder,
  presetValue = '',
  keyboard = 'default',
  isMutliLine = false,
  onChange,
}: {
  label: string;
  placeholder: string;
  presetValue?: string;
  keyboard?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
  isMutliLine?: boolean;
  onChange: (change: string) => void;
}) {
  const [value, setValue] = useState<string>(presetValue);

  const handleInputChange = (change: string) => {
    setValue(change);
    onChange(change);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboard}
        multiline={isMutliLine}
        numberOfLines={isMutliLine ? 4 : undefined}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
});

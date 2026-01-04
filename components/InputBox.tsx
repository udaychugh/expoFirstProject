import { Colors } from '@/assets/colors/colors';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import Clickable from './Clickable';

export default function InputBox({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  enabled = true,
  isPassword = false,
  error,
  returnKeyType,
  onSubmitEditing,
  inputRef,
}: {
  label: string;
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  enabled?: boolean;
  isPassword?: boolean;
  error?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput | null>;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWithIcon}>
        {icon}
        <TextInput
          ref={inputRef}
          style={styles.inputText}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize="none"
          editable={enabled}
          placeholderTextColor={Colors.placeholderGray}
          secureTextEntry={isPassword && !showPassword}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {isPassword && enabled && (
          <Clickable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff color={Colors.placeholderGray} size={20} />
            ) : (
              <Eye color={Colors.placeholderGray} size={20} />
            )}
          </Clickable>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {},
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.labelGray,
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    fontSize: 12,
    color: Colors.primaryPressed,
    marginTop: 4,
  },
});

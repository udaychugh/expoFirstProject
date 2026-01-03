import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

export default function PrimaryButton({
  title,
  enabled = true,
  isLoading = false,
  backgroundColor,
  fontSize,
  onPress,
}: {
  title: string;
  enabled?: boolean;
  isLoading?: boolean;
  backgroundColor?: string;
  fontSize?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        backgroundColor && { backgroundColor },
        !enabled && styles.buttonDisabled,
        !backgroundColor && pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={!enabled}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Text
          style={[
            styles.primaryButtonText,
            { fontSize: fontSize ? fontSize : 18 },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: Colors.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
});

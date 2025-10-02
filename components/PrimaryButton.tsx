import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PrimaryButton({
  title,
  enabled = true,
  onPress,
}: {
  title: string;
  enabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, !enabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={!enabled}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
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
});

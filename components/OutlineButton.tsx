import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function OutlineButton({
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
      style={[styles.outlineButton, !enabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={!enabled}
    >
      <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outlineButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

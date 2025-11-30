import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

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
    <Pressable
      style={({ pressed }) => [
        styles.outlineButton,
        !enabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={!enabled}
    >
      <Text style={styles.outlineButtonText}>{title}</Text>
    </Pressable>
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
  buttonPressed: {
    backgroundColor: Colors.pressedWhite,
    transform: [{ scale: 0.99 }],
  },
});

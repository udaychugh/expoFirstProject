import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.secondaryButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(225, 29, 72, 0.1)', borderless: false }}
    >
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  secondaryButton: {
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonPressed: {
    color: Colors.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
});

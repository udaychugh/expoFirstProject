import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Info({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={styles.feature}>
      {icon}
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  feature: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
});

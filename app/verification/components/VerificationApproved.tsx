import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

export default function VerificationApproved() {
  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusIconBox, { backgroundColor: '#F0FDF4' }]}>
        <CheckCircle2 color="#22C55E" size={48} />
      </View>
      <Text style={[styles.statusTitle, { color: '#22C55E' }]}>
        You are Verified
      </Text>
      <Text style={styles.statusDescription}>
        Congratulations! Your account is fully verified.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  statusIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});

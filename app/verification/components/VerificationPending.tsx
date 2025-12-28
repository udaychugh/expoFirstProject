import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function VerificationPending() {
  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusIconBox, { backgroundColor: '#FFFBEB' }]}>
        <Clock color="#F59E0B" size={48} />
      </View>
      <Text style={styles.statusTitle}>Waiting for Approval</Text>
      <Text style={styles.statusDescription}>
        Your documents have been submitted and are currently being reviewed by
        our team. This process usually takes 24-48 hours.
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

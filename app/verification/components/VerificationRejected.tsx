import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { XCircle, Mail } from 'lucide-react-native';
import { Colors } from '@/assets/colors/colors';

export default function VerificationRejected() {
  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusIconBox, { backgroundColor: '#FEF2F2' }]}>
        <XCircle color="#EF4444" size={48} />
      </View>
      <Text style={[styles.statusTitle, { color: '#EF4444' }]}>
        Verification Reject
      </Text>
      <Text style={styles.statusDescription}>
        Unfortunately, your verification request was not approved.
      </Text>

      <View style={styles.supportBox}>
        <Mail color="#6B7280" size={20} />
        <Text style={styles.supportText}>
          Write mail to us at{' '}
          <Text style={styles.supportEmail}>support@freelab.tech</Text> for more
          support or help to complete verification.
        </Text>
      </View>
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
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 12,
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  supportEmail: {
    fontWeight: '600',
    color: Colors.primary,
  },
});

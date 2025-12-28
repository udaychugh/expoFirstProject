import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'expo-router';
import { Colors } from '@/assets/colors/colors';

export default function NotVerified({ status }: { status: string }) {
  const router = useRouter();

  const title =
    status === 'pending'
      ? 'Account Status Pending'
      : status === 'rejected'
      ? 'Account Rejected'
      : 'Account Not Verified';

  const description =
    status === 'pending'
      ? 'Please wait for admin to approve your account.'
      : status === 'rejected'
      ? 'Go to more details to check what can be done now to fix the issue.'
      : 'Complete verification to gain trust and get more matches';

  const buttonTitle =
    status === 'pending'
      ? 'See Status'
      : status === 'rejected'
      ? 'More Details'
      : 'Complete Verification';

  const handleVerification = () => {
    router.push('/verification/verification');
  };

  return (
    <View style={styles.verificationBanner}>
      <View style={styles.verificationContent}>
        <AlertTriangle color="#F59E0B" size={24} />
        <View style={styles.verificationText}>
          <Text style={styles.verificationTitle}>{title}</Text>
          <Text style={styles.verificationSubtitle}>{description}</Text>
        </View>
      </View>
      <PrimaryButton
        title={buttonTitle}
        onPress={handleVerification}
        backgroundColor={Colors.alertColor}
        fontSize={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  verificationBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationText: {
    flex: 1,
    marginLeft: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#92400E',
    marginTop: 2,
  },

  // unused styles

  verificationButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

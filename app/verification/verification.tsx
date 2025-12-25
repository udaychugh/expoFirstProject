import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CircleAlert as AlertCircle,
  Clock,
  XCircle,
  CheckCircle2,
  Mail,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/assets/colors/colors';
import IdCardUpload from './components/idCardUpload';
import PrimaryButton from '@/components/PrimaryButton';
import { ShowAlert } from '@/components/Alert';

export default function Verification() {
  const router = useRouter();
  const [verificationData, setVerificationData] = useState({
    idCard: null as string | null,
    selfie: null as string | null,
  });

  const [idCardType, setIdCardType] = useState<string>('');

  const { user, profile } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take a selfie'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVerificationData((prev) => ({
        ...prev,
        selfie: result.assets[0].uri,
      }));
    }
  };

  const handleSubmitVerification = async () => {
    if (!verificationData.idCard) {
      ShowAlert({ type: 'error', title: 'Please upload ID card' });
      return;
    }

    if (!idCardType) {
      ShowAlert({ type: 'error', title: 'Please select ID card type' });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      ShowAlert({
        type: 'success',
        title: 'Verification Submitted',
        message:
          'Your verification documents have been submitted successfully. We will review them within 24-48 hours.',
      });
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Account Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!profile?.verificationStatus ||
          profile?.verificationStatus === 'not_submitted') && (
          <>
            <View style={styles.infoCard}>
              <AlertCircle color="#F59E0B" size={24} />
              <Text style={styles.infoTitle}>Verification Required</Text>
              <Text style={styles.infoText}>
                To ensure the safety and authenticity of our community, please
                complete your account verification by uploading the required
                documents.
              </Text>
            </View>

            {/* ID Card Upload */}
            <IdCardUpload
              verificationData={verificationData}
              setVerificationData={setVerificationData}
              idCardType={idCardType}
              setIdCardType={setIdCardType}
            />

            {/* Guidelines */}
            <View style={styles.guidelines}>
              <Text style={styles.guidelinesTitle}>
                Verification Guidelines
              </Text>
              <View style={styles.guideline}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.guidelineText}>
                  Ensure your ID card is clearly visible and readable
                </Text>
              </View>
              <View style={styles.guideline}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.guidelineText}>
                  Verification typically takes 24-48 hours
                </Text>
              </View>
            </View>
          </>
        )}

        {profile?.verificationStatus === 'pending' && (
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusIconBox, { backgroundColor: '#FFFBEB' }]}
            >
              <Clock color="#F59E0B" size={48} />
            </View>
            <Text style={styles.statusTitle}>Waiting for Approval</Text>
            <Text style={styles.statusDescription}>
              Your documents have been submitted and are currently being
              reviewed by our team. This process usually takes 24-48 hours.
            </Text>
          </View>
        )}

        {profile?.verificationStatus === 'rejected' && (
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusIconBox, { backgroundColor: '#FEF2F2' }]}
            >
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
                <Text style={styles.supportEmail}>support@freelab.tech</Text>{' '}
                for more support or help to complete verification.
              </Text>
            </View>
          </View>
        )}

        {profile?.verificationStatus === 'approved' && (
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusIconBox, { backgroundColor: '#F0FDF4' }]}
            >
              <CheckCircle2 color="#22C55E" size={48} />
            </View>
            <Text style={[styles.statusTitle, { color: '#22C55E' }]}>
              You are Verified
            </Text>
            <Text style={styles.statusDescription}>
              Congratulations! Your account is fully verified.
            </Text>
          </View>
        )}
      </ScrollView>

      {(!profile?.verificationStatus ||
        profile?.verificationStatus === 'not_submitted') && (
        <View style={styles.footer}>
          <PrimaryButton
            title={isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            onPress={handleSubmitVerification}
            enabled={!isSubmitting && verificationData.idCard != undefined}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  guidelines: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#E11D48',
    marginRight: 8,
    fontWeight: '600',
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
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

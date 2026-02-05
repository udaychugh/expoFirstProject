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
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import ApiService from '@/services/api';
import PrimaryButton from '@/components/PrimaryButton';
import { ShowAlert } from '@/components/Alert';
import VerificationPending from './components/VerificationPending';
import VerificationRejected from './components/VerificationRejected';
import VerificationApproved from './components/VerificationApproved';
import VerificationNotSubmitted from './components/VerificationNotSubmitted';

export default function Verification() {
  const router = useRouter();
  const [verificationData, setVerificationData] = useState({
    idCard: null as string | null,
    selfie: null as string | null,
  });

  const [idCardType, setIdCardType] = useState<string>('');

  const { user, profile, updateProfile } = useAuth();

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

    try {
      const response = await ApiService.submitVerification({
        idCardImage: verificationData.idCard,
        selfieImage: verificationData.selfie || '',
        idType: idCardType,
        fullName: profile?.fullName || user?.fullName || 'user',
      });

      if (response.success) {
        // Update profile status locally
        if (response.data && response.data.verificationStatus) {
          updateProfile({
            verificationStatus: response.data.verificationStatus,
          });
        } else {
          // Fallback to pending if data not returned
          updateProfile({ verificationStatus: 'pending' });
        }

        ShowAlert({
          type: 'success',
          title: 'Verification Submitted',
          message:
            response.message ||
            'Your verification documents have been submitted successfully.',
        });

        router.back();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Submission Failed',
          message: response.error || 'Failed to submit verification documents.',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <VerificationNotSubmitted
            verificationData={verificationData}
            setVerificationData={setVerificationData}
            idCardType={idCardType}
            setIdCardType={setIdCardType}
          />
        )}

        {profile?.verificationStatus === 'pending' && <VerificationPending />}

        {profile?.verificationStatus === 'rejected' && <VerificationRejected />}

        {profile?.verificationStatus === 'approved' && <VerificationApproved />}
      </ScrollView>

      {(!profile?.verificationStatus ||
        profile?.verificationStatus === 'not_submitted') && (
        <View style={styles.footer}>
          <PrimaryButton
            title={'Submit for Verification'}
            onPress={handleSubmitVerification}
            isLoading={isSubmitting}
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
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

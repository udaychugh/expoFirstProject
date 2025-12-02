import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Upload, Camera, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Verification() {
  const router = useRouter();
  const [verificationData, setVerificationData] = useState({
    idCard: null as string | null,
    selfie: null as string | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickIdCard = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVerificationData(prev => ({ ...prev, idCard: result.assets[0].uri }));
    }
  };

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take a selfie');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVerificationData(prev => ({ ...prev, selfie: result.assets[0].uri }));
    }
  };

  const handleSubmitVerification = async () => {
    if (!verificationData.idCard || !verificationData.selfie) {
      Alert.alert('Incomplete', 'Please upload both ID card and selfie to proceed');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Verification Submitted',
        'Your verification documents have been submitted successfully. We will review them within 24-48 hours.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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
        <View style={styles.infoCard}>
          <AlertCircle color="#F59E0B" size={24} />
          <Text style={styles.infoTitle}>Verification Required</Text>
          <Text style={styles.infoText}>
            To ensure the safety and authenticity of our community, please complete your account verification by uploading the required documents.
          </Text>
        </View>

        {/* ID Card Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Upload ID Card</Text>
          <Text style={styles.sectionSubtitle}>
            Upload a clear photo of your government-issued ID (Aadhar Card, Passport, Driver's License)
          </Text>
          
          <TouchableOpacity style={styles.uploadCard} onPress={pickIdCard}>
            {verificationData.idCard ? (
              <View style={styles.uploadedContainer}>
                <Image source={{ uri: verificationData.idCard }} style={styles.uploadedImage} />
                <View style={styles.uploadedOverlay}>
                  <CheckCircle color="#10B981" size={32} />
                  <Text style={styles.uploadedText}>ID Card Uploaded</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Upload color="#9CA3AF" size={32} />
                <Text style={styles.uploadText}>Tap to upload ID card</Text>
                <Text style={styles.uploadSubtext}>JPG, PNG up to 5MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Verification Guidelines</Text>
          <View style={styles.guideline}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.guidelineText}>Ensure your ID card is clearly visible and readable</Text>
          </View>
          <View style={styles.guideline}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.guidelineText}>Verification typically takes 24-48 hours</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!verificationData.idCard || !verificationData.selfie) && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmitVerification}
          disabled={!verificationData.idCard || !verificationData.selfie || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  uploadedContainer: {
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  uploadedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
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
});
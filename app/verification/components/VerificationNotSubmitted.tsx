import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle } from 'lucide-react-native';
import IdCardUpload from './idCardUpload';

interface VerificationNotSubmittedProps {
  verificationData: {
    idCard: string | null;
    selfie: string | null;
  };
  setVerificationData: React.Dispatch<
    React.SetStateAction<{
      idCard: string | null;
      selfie: string | null;
    }>
  >;
  idCardType: string;
  setIdCardType: React.Dispatch<React.SetStateAction<string>>;
}

export default function VerificationNotSubmitted({
  verificationData,
  setVerificationData,
  idCardType,
  setIdCardType,
}: VerificationNotSubmittedProps) {
  return (
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
        <Text style={styles.guidelinesTitle}>Verification Guidelines</Text>
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
  );
}

const styles = StyleSheet.create({
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
});

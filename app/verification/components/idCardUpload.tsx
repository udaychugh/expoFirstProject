import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { CheckCircle, Upload, ChevronDown, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/assets/colors/colors';
import Clickable from '@/components/Clickable';

const ID_CARD_TYPES = ['Aadhar Card', 'Passport', 'Driver License', 'Pancard'];

export default function IdCardUpload({
  verificationData,
  setVerificationData,
  idCardType,
  setIdCardType,
}: {
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
}) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const pickIdCard = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVerificationData((prev) => ({
        ...prev,
        idCard: result.assets[0].uri,
      }));
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Identity Verification</Text>
      <Text style={styles.sectionSubtitle}>
        Select your ID type and upload a clear photo of the document.
      </Text>

      {/* ID Type Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select ID Card Type</Text>
        <Clickable
          style={styles.pickerButton}
          onPress={() => setIsPickerVisible(true)}
        >
          <Text
            style={[styles.pickerButtonText, !idCardType && styles.placeholder]}
          >
            {idCardType || 'Choose ID Type'}
          </Text>
          <ChevronDown color="#6B7280" size={20} />
        </Clickable>
      </View>

      {/* Upload Box */}
      <Clickable style={styles.uploadCard} onPress={pickIdCard}>
        {verificationData.idCard ? (
          <View style={styles.uploadedContainer}>
            <Image
              source={{ uri: verificationData.idCard }}
              style={styles.uploadedImage}
            />
            <View style={styles.uploadedOverlay}>
              <CheckCircle color="#10B981" size={32} />
              <Text style={styles.uploadedText}>
                {idCardType ? `${idCardType} Uploaded` : 'ID Card Uploaded'}
              </Text>
              <Text style={styles.changeText}>Tap to change photo</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Upload color="#9CA3AF" size={32} />
            <Text style={styles.uploadText}>Tap to upload ID card photo</Text>
            <Text style={styles.uploadSubtext}>JPG, PNG up to 5MB</Text>
          </View>
        )}
      </Clickable>

      {/* Picker Modal */}
      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsPickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select ID Type</Text>
            </View>
            <FlatList
              data={ID_CARD_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Clickable
                  style={styles.optionItem}
                  onPress={() => {
                    setIdCardType(item);
                    setIsPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      idCardType === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                  {idCardType === item && (
                    <Check color={Colors.primary} size={20} />
                  )}
                </Clickable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
    lineHeight: 20,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 200,
  },
  uploadCardDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 200,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
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
  changeText: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#E11D48',
    fontWeight: '600',
  },
});

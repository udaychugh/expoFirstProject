import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image as RNImage,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Plus, X } from 'lucide-react-native';

export default function AddImages({ handleNext }: { handleNext: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    if (images.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload maximum 6 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleTakePhoto = async () => {
    if (images.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload maximum 6 images');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSaveButton = () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one photo to continue', [
        { text: 'OK' },
      ]);
      return;
    }

    // TODO: Implement save functionality
    console.log({ images });
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Add Your Photos</Text>
          <Text style={profileStyles.stepSubtitle}>
            It's important to add images as the final step to complete your
            profile
          </Text>

          <View style={profileStyles.form}>
            <View style={styles.section}>
              <Text style={styles.description}>
                Add up to 6 photos to showcase yourself. The first photo will be
                your main profile picture.
              </Text>

              <View style={styles.imagesGrid}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <RNImage source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <X color="#FFFFFF" size={16} />
                    </TouchableOpacity>
                    {index === 0 && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>Main</Text>
                      </View>
                    )}
                  </View>
                ))}

                {images.length < 6 && (
                  <View style={styles.addButtonContainer}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleImagePicker}
                    >
                      <Plus color="#9CA3AF" size={32} />
                      <Text style={styles.addButtonText}>Add Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={handleTakePhoto}
                    >
                      <Camera color={Colors.primary} size={20} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {images.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    📸 No photos added yet
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Tap "Add Photo" to get started
                  </Text>
                </View>
              )}

              {images.length > 0 && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    ✓ {images.length} photo{images.length > 1 ? 's' : ''} added
                  </Text>
                  <Text style={styles.infoSubtext}>
                    {6 - images.length} slot{6 - images.length !== 1 ? 's' : ''}{' '}
                    remaining
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={isLoading ? 'Saving...' : 'Complete Profile'}
        enabled={!isLoading}
        onPress={handleSaveButton}
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mainBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  addButtonContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  addButton: {
    width: 100,
    height: 80,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  addButtonText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  emptyState: {
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#991B1B',
  },
});

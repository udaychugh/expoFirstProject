import { profileStyles } from '@/app/(onboarding)/components/styles';
import { Colors } from '@/assets/colors/colors';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AppImage from './AppImage';
import { ShowAlert } from './Alert';
import * as ImagePicker from 'expo-image-picker';
import { Plus, X } from 'lucide-react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';

export default function ImageAdd({
  images,
  setImages,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleImagePicker = async () => {
    if (images.length >= 6) {
      ShowAlert({
        type: 'error',
        title: 'Limit Reached',
        message: 'You can upload maximum 6 images',
      });
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

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <View style={profileStyles.form}>
      <View style={styles.section}>
        <Text style={styles.description}>
          Add up to 6 photos to showcase yourself. The first photo will be your
          main profile picture.
        </Text>

        <View style={styles.imagesGrid}>
          <NestableScrollContainer>
            <NestableDraggableFlatList
              data={images}
              numColumns={3}
              renderItem={({ item, drag, isActive }) => {
                const index = images.indexOf(item);
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.imageContainer,
                      isActive && styles.imageContainerActive,
                    ]}
                    onLongPress={drag}
                    disabled={isActive}
                  >
                    <AppImage
                      src={item}
                      style={styles.image}
                      disableFullScreen={false}
                    />
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <X color="#FFFFFF" size={16} />
                    </Pressable>
                    {index === 0 && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>Main</Text>
                      </View>
                    )}
                  </Pressable>
                );
              }}
              onDragEnd={({ data }) => setImages(data)}
              keyExtractor={(item, index) => `image-${index}`}
              ListFooterComponent={
                images.length < 6 ? (
                  <View style={styles.addButtonContainer}>
                    <Pressable
                      style={styles.addButton}
                      onPress={handleImagePicker}
                    >
                      <Plus color="#9CA3AF" size={32} />
                      <Text style={styles.addButtonText}>Add Photo</Text>
                    </Pressable>
                  </View>
                ) : null
              }
            />
          </NestableScrollContainer>
        </View>

        {images.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📸 No photos added yet</Text>
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
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: 6,
  },
  imageContainerActive: {
    opacity: 0.7,
    transform: [{ scale: 1.05 }],
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

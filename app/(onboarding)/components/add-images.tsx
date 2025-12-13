import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { profileStyles } from './styles';
import PrimaryButton from '@/components/PrimaryButton';
import ImageAdd from '@/components/image-add';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function AddImages({ handleNext }: { handleNext: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleSaveButton = async () => {
    if (images.length === 0) {
      ShowAlert({
        type: 'error',
        title: 'No Images',
        message: 'Please add at least one photo to continue',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.uploadMultipleImages(images);

      if (response.success) {
        handleNext();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Upload Failed',
          message: response.error || 'Failed to upload images',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Add Your Photos</Text>
          <Text style={profileStyles.stepSubtitle}>
            It's important to add images as the final step to complete your
            profile
          </Text>
          <ImageAdd
            images={images}
            setImages={setImages}
            setScrollEnabled={setScrollEnabled}
          />
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

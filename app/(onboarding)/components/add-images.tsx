import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { profileStyles } from './styles';
import PrimaryButton from '@/components/PrimaryButton';
import ImageAdd from '@/components/image-add';

export default function AddImages({ handleNext }: { handleNext: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

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

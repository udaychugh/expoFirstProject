import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import { useAuth } from '@/contexts/AuthContext';
import ImageAdd from '@/components/image-add';
import ApiService from '@/services/api';

export default function EditImages() {
  const { profile, updateProfile } = useAuth();

  const [images, setImages] = useState<string[]>(
    profile?.images.map((image) => image.url) || [],
  );
  const [isLoading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [action, setAction] = useState('');

  const handleSetImages = (
    newImagesInput: string[] | ((prev: string[]) => string[]),
  ) => {
    const newImages =
      typeof newImagesInput === 'function'
        ? newImagesInput(images)
        : newImagesInput;

    if (newImages.length < images.length) {
      const removedUrl = images.find((img) => !newImages.includes(img));
      if (removedUrl) {
        const imageProfile = profile?.images.find(
          (img) => img.url === removedUrl,
        );

        if (imageProfile) {
          ApiService.deleteProfileImage(imageProfile._id || imageProfile.id)
            .then((res) => {
              if (res.success) {
                if (updateProfile && profile) {
                  const updatedImages = profile.images.filter(
                    (img) => img.url !== removedUrl,
                  );
                  updateProfile({ images: updatedImages });
                }
              }
            })
            .catch((err) => console.error('Error deleting image', err));
        }
      }
    } else if (newImages.length > images.length) {
      const addedImage = newImages.find((img) => !images.includes(img));
      if (addedImage) {
        setLoading(true);
        ApiService.uploadProfileImage(addedImage)
          .then(async (res) => {
            if (res.success) {
              const meRes = await ApiService.getMe();
              if (meRes.success && meRes.data) {
                const updatedUser = meRes.data.user;
                if (updateProfile) {
                  updateProfile(updatedUser);
                }
                setImages(updatedUser.images.map((img) => img.url));
              }
            }
          })
          .catch((err) => {
            console.error('Error uploading image', err);
            setImages(images);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }

    setAction('Save');
    setImages(newImages);
  };

  const handleSaveButton = () => {};

  return (
    <RenderSection
      title="Profile Photos"
      isExpanded={true}
      action={action}
      loading={isLoading}
      onActionClick={handleSaveButton}
    >
      <ImageAdd
        images={images}
        setImages={handleSetImages}
        setScrollEnabled={setScrollEnabled}
      />
    </RenderSection>
  );
}

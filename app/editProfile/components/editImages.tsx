import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import { useAuth } from '@/contexts/AuthContext';
import ImageAdd from '@/components/image-add';

export default function EditImages() {
  const { profile } = useAuth();

  const [images, setImages] = useState<string[]>(
    profile?.images.map((image) => image.url) || []
  );
  const [isLoading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [action, setAction] = useState('');

  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
    setAction('Save Changes');
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
        setImages={(images) => {
          setAction('Save');
          setImages(images);
        }}
        setScrollEnabled={setScrollEnabled}
      />
    </RenderSection>
  );
}

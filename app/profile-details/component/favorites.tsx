import React from 'react';
import RenderSection from './renderSection';
import { ProfileData } from '@/app/edit-profile';
import ProfileInput from './ProfileInput';

export default function Favorites({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  return (
    <RenderSection title="Favorites" isExpanded={false}>
      <>
        <ProfileInput
          label="Favorite Books"
          placeholder="Describe your favorite books"
          presetValue={profile?.favoriteBooks}
          onChange={(value) => handleInputChange('favoriteBooks', value)}
        />

        <ProfileInput
          label="Favorite Songs"
          placeholder="Describe your favorite songs"
          presetValue={profile?.favoriteSongs}
          onChange={(value) => handleInputChange('favoriteSongs', value)}
        />

        <ProfileInput
          label="Favorite Movies"
          placeholder="Describe your favorite movies"
          presetValue={profile?.favoriteMovies}
          onChange={(value) => handleInputChange('favoriteMovies', value)}
        />

        <ProfileInput
          label="Vacation Destination"
          placeholder="Describe your vacation destination"
          presetValue={profile?.vacationDestination}
          onChange={(value) => handleInputChange('vacationDestination', value)}
        />
      </>
    </RenderSection>
  );
}

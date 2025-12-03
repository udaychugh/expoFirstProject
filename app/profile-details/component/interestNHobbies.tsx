import React from 'react';
import RenderSection from './renderSection';
import { MultiSelectField, ProfileData } from '@/app/edit-profile';

export default function InterestsAndHobbies({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  const hobbiesOptions = [
    'Movies',
    'Books',
    'Travel',
    'Biking',
    'Hiking',
    'Soccer',
    'Cricket',
    'Foods',
    'Blogging',
    'Dance',
    'Theater',
    'Photography',
    'Music',
  ];

  const sportsOptions = [
    'Badminton',
    'Swimming',
    'Reading',
    'Yoga',
    'Gym',
    'Running',
    'Cycling',
    'Tennis',
    'Basketball',
    'Football',
  ];
  return (
    <RenderSection title="Interests & Hobbies" isExpanded={false}>
      <>
        <MultiSelectField
          label="Hobbies"
          options={hobbiesOptions}
          selectedValues={profile.hobbies}
          onSelectionChange={(values) => handleInputChange('hobbies', values)}
        />

        <MultiSelectField
          label="Sports & Fitness"
          options={sportsOptions}
          selectedValues={profile.sportsAndFitness}
          onSelectionChange={(values) =>
            handleInputChange('sportsAndFitness', values)
          }
        />
      </>
    </RenderSection>
  );
}

import React from 'react';
import RenderSection from './renderSection';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { ProfileData, SelectField } from '@/app/edit-profile';
import ProfileInput from './ProfileInput';

export default function LifeStyle({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  return (
    <RenderSection title="Lifestyle" isExpanded={false}>
      <>
        <SelectField
          label="Diet"
          options={[
            'Vegetarian',
            'Eggetarian',
            'Both',
            'Non-vegetarian',
            'Jain',
            'Vegan',
          ]}
          selectedValue={profile?.diet}
          onSelectionChange={(value) => handleInputChange('diet', value)}
        />

        <SelectField
          label="Drinking Habit"
          options={['No', 'Regular', 'Occasional']}
          selectedValue={profile?.drinkingHabit}
          onSelectionChange={(value) =>
            handleInputChange('drinkingHabit', value)
          }
        />

        <SelectField
          label="Smoking Habit"
          options={['No', 'Regular', 'Occasional']}
          selectedValue={profile?.smokingHabit}
          onSelectionChange={(value) =>
            handleInputChange('smokingHabit', value)
          }
        />

        <ProfileInput
          label="Dress Style"
          placeholder="Describe your dress style"
          presetValue={profile?.dressStyle}
          onChange={(value) => handleInputChange('dressStyle', value)}
        />
      </>
    </RenderSection>
  );
}

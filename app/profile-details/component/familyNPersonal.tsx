import React from 'react';
import RenderSection from './renderSection';
import { ProfileData, SelectField } from '@/app/edit-profile';
import ProfileInput from './ProfileInput';

export default function FamilyAndPersonal({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  return (
    <RenderSection title="Family & Personal" isExpanded={false}>
      <>
        <SelectField
          label="Do you have children?"
          options={['No', 'Yes', 'Prefer not to say']}
          selectedValue={profile.hasChildren}
          onSelectionChange={(value) => handleInputChange('hasChildren', value)}
        />

        <ProfileInput
          label="About Me"
          placeholder="Tell us about yourself..."
          presetValue={profile?.bio}
          onChange={(value) => handleInputChange('description', value)}
          isMutliLine={true}
        />
      </>
    </RenderSection>
  );
}

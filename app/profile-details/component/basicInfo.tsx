import React from 'react';
import RenderSection from './renderSection';
import ProfileInput from './ProfileInput';
import { MultiSelectField, ProfileData, SelectField } from '@/app/edit-profile';

export default function BasicInfo({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  const languages = [
    'Bengali',
    'Hindi',
    'English',
    'Marathi',
    'Tamil',
    'Telugu',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'Odia',
    'Assamese',
  ];
  return (
    <RenderSection title="Basic Information" isExpanded={true}>
      <>
        <ProfileInput
          label="Full Name"
          placeholder="Enter your full name"
          presetValue={profile?.fullName}
          onChange={(value) => handleInputChange('name', value)}
        />

        <ProfileInput
          label="City"
          placeholder="Enter your city"
          presetValue={profile?.location?.city}
          onChange={(value) => handleInputChange('city', value)}
        />

        <ProfileInput
          label="State"
          placeholder="Enter your state"
          presetValue={profile?.location?.state}
          onChange={(value) => handleInputChange('state', value)}
        />

        <ProfileInput
          label="Country"
          placeholder="Enter your country"
          presetValue={profile?.location?.country}
          onChange={(value) => handleInputChange('country', value)}
        />

        <ProfileInput
          label="Occupation"
          placeholder="Enter your occupation"
          presetValue={profile?.occupation}
          onChange={(value) => handleInputChange('occupation', value)}
        />

        <SelectField
          label="Gender"
          options={['Male', 'Female', 'Prefer Not To Say']}
          selectedValue={profile?.gender}
          onSelectionChange={(value) => handleInputChange('gender', value)}
        />

        <ProfileInput
          label="Phone Number"
          placeholder="Enter your phone number"
          presetValue={profile?.phone}
          onChange={(value) => handleInputChange('phoneNumber', value)}
          keyboard="phone-pad"
        />

        <ProfileInput
          label="Email"
          placeholder="Enter your email"
          presetValue={profile?.email}
          onChange={(value) => handleInputChange('email', value)}
          keyboard="email-address"
        />

        <ProfileInput
          label="Education"
          placeholder="Enter your education"
          presetValue={profile?.education}
          onChange={(value) => handleInputChange('education', value)}
        />

        <SelectField
          label="Marital Status"
          options={['Single', 'Widowed', 'Married', 'Divorced', 'Separated']}
          selectedValue={profile.maritalStatus}
          onSelectionChange={(value) =>
            handleInputChange('maritalStatus', value)
          }
        />

        <MultiSelectField
          label="Languages Spoken"
          options={languages}
          selectedValues={profile.languagesSpoken}
          onSelectionChange={(values) =>
            handleInputChange('languagesSpoken', values)
          }
        />
      </>
    </RenderSection>
  );
}

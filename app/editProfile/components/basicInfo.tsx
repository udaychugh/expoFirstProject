import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function BasicInfo() {
  const { profile, updateProfile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(profile?.fullName);
  const [city, setCity] = useState(profile?.location?.city);
  const [state, setState] = useState(profile?.location?.state);
  const [country, setCountry] = useState(profile?.location?.country);
  const [education, setEducation] = useState(profile?.education);
  const [occupation, setOccupation] = useState(profile?.occupation);
  const [annualSalary, setAnnualSalary] = useState(profile?.annualSalary);
  const [jobLocation, setJobLocation] = useState(profile?.jobLocation);
  const [permanentAddress, setPermanentAddress] = useState(
    profile?.permanentLocation,
  );
  const [bio, setBio] = useState(profile?.bio);

  function checkForAction({
    newValue,
    oldValue,
  }: {
    newValue: string;
    oldValue?: string;
  }) {
    if (newValue == oldValue) {
      setAction('');
    } else {
      setAction('Save');
    }
  }

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: name,
        location: {
          city: city || '',
          state: state || '',
          country: country || '',
          coordinates: (profile?.location as any)?.coordinates || {
            latitude: 0,
            longitude: 0,
          },
        },
        jobLocation: jobLocation,
        permanentLocation: permanentAddress,
        occupation: occupation,
        annualSalary: annualSalary,
        education: education,
        bio: bio,
      };

      const response = await ApiService.updateBasicInfo(updateData);

      if (response.success) {
        setAction('');
        updateProfile(updateData);
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Basic information updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update basic information',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RenderSection
      title="Basic Information"
      isExpanded={true}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <ProfileInput
          label="Full Name"
          placeholder="Enter your full name"
          presetValue={name}
          onChange={(value) => {
            checkForAction({ newValue: value, oldValue: profile?.fullName });
            setName(value);
          }}
        />

        <ProfileInput
          label="City"
          placeholder="Enter your city"
          presetValue={city}
          onChange={(value) => {
            checkForAction({
              newValue: value,
              oldValue: profile?.location?.city,
            });
            setCity(value);
          }}
        />

        <ProfileInput
          label="State"
          placeholder="Enter your state"
          presetValue={state}
          onChange={(value) => {
            checkForAction({
              newValue: value,
              oldValue: profile?.location?.state,
            });
            setState(value);
          }}
        />

        <ProfileInput
          label="Country"
          placeholder="Enter your country"
          presetValue={country}
          enabled={false}
          onChange={(value) => {
            checkForAction({
              newValue: value,
              oldValue: profile?.location?.country,
            });
            setCountry(value);
          }}
        />

        <ProfileInput
          label="Education"
          placeholder="Enter your education"
          presetValue={education}
          onChange={(value) => {
            checkForAction({ newValue: value, oldValue: profile?.education });
            setEducation(value);
          }}
        />

        <ProfileInput
          label="Occupation"
          placeholder="Enter your occupation"
          presetValue={occupation}
          onChange={(value) => {
            checkForAction({ newValue: value, oldValue: profile?.occupation });
            setOccupation(value);
          }}
        />

        <ProfileInput
          label="Annual Salary"
          placeholder="Enter your annual salary"
          presetValue={annualSalary}
          onChange={(value) => {
            checkForAction({
              newValue: value,
              oldValue: profile?.annualSalary,
            });
            setAnnualSalary(value);
          }}
        />

        <ProfileInput
          label="Job Location"
          placeholder="Enter your job location"
          presetValue={jobLocation}
          onChange={(value) => {
            checkForAction({ newValue: value, oldValue: profile?.jobLocation });
            setJobLocation(value);
          }}
        />

        <ProfileInput
          label="Permanent Address"
          placeholder="Enter your permanent address"
          presetValue={permanentAddress}
          onChange={(value) => {
            checkForAction({
              newValue: value,
              oldValue: profile?.permanentLocation,
            });
            setPermanentAddress(value);
          }}
        />

        <ProfileInput
          label="Bio"
          placeholder="Enter your bio"
          presetValue={bio}
          isMutliLine={true}
          onChange={(value) => {
            checkForAction({ newValue: value, oldValue: profile?.bio });
            setBio(value);
          }}
        />
      </>
    </RenderSection>
  );
}

import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';
import { RELIGIONS } from '@/app/(onboarding)/models/religions';
import { SelectField } from './core/selectField';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function PhysicalAttr() {
  const { profile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [dob, setDob] = useState(profile?.dateOfBirth?.split('T')[0] ?? '');
  const [timeOfBirth, setTimeOfBirth] = useState(profile?.timeOfBirth ?? '');
  const [placeOfBirth, setPlaceOfBirth] = useState(profile?.placeOfBirth ?? '');
  const [gender, setGender] = useState(profile?.gender ?? '');
  const [religion, setReligion] = useState(profile?.religion ?? '');
  const [caste, setCaste] = useState(profile?.caste ?? '');
  const [height, setHeight] = useState(profile?.height ?? '');
  const [manglik, setManglik] = useState(profile?.manglik ?? false);
  const [maritalStatus, setMaritalStatus] = useState(profile?.maritalStatus ?? '');
  const [bloodGroup, setBloodGroup] = useState(profile?.bloodGroup ?? '');

  const handleInputChange = (field: string, value: string) => {
    setAction('Save');
    switch (field) {
      case 'dob':
        setDob(value);
        break;
      case 'timeOfBirth':
        setTimeOfBirth(value);
        break;
      case 'placeOfBirth':
        setPlaceOfBirth(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'religion':
        setReligion(value);
        break;
      case 'caste':
        setCaste(value);
        break;
      case 'height':
        setHeight(value);
        break;
      case 'manglik':
        setManglik(value === 'Yes');
        break;
      case 'maritalStatus':
        setMaritalStatus(value);
        break;
      case 'bloodGroup':
        setBloodGroup(value);
        break;
    }
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const response = await ApiService.updatePersonalDetails({
        dateOfBirth: dob,
        timeOfBirth: timeOfBirth,
        placeOfBirth: placeOfBirth,
        gender: gender,
        manglik: manglik,
        religion: religion,
        caste: caste,
        maritalStatus: maritalStatus,
        height: height,
        bloodGroup: bloodGroup,
      });

      if (response.success) {
        setAction('');
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Personal details updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update personal details',
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
      title="Personal Details"
      isExpanded={false}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <ProfileInput
          label="Date of Birth"
          placeholder="dd/mm/yyyy"
          presetValue={dob}
          onChange={(value) => handleInputChange('dob', value)}
        />

        <ProfileInput
          label="Time of Birth"
          placeholder="hh:mm:ss"
          presetValue={timeOfBirth}
          onChange={(value) => handleInputChange('timeOfBirth', value)}
        />

        <ProfileInput
          label="Place of Birth"
          placeholder="eg. Karnal, Haryana"
          presetValue={placeOfBirth}
          onChange={(value) => handleInputChange('placeOfBirth', value)}
        />

        <SelectField
          label="Gender"
          options={[
            { id: 'Male', name: 'Male', image: '' },
            { id: 'Female', name: 'Female', image: '' },
          ]}
          selectedValue={gender}
          onSelectionChange={(value) => handleInputChange('gender', value)}
        />

        <SelectField
          label="Religion"
          options={RELIGIONS}
          selectedValue={religion}
          onSelectionChange={(value) => handleInputChange('religion', value)}
        />

        <ProfileInput
          label="Caste"
          placeholder="caste/community"
          presetValue={caste}
          onChange={(value) => handleInputChange('caste', value)}
        />

        <ProfileInput
          label="Height"
          placeholder="e.g., 5'6"
          presetValue={height}
          onChange={(value) => handleInputChange('height', value)}
        />

        <SelectField
          label="Manglik"
          options={[
            { id: 'Yes', name: 'Yes', image: '' },
            { id: 'No', name: 'No', image: '' },
          ]}
          selectedValue={manglik ? 'Yes' : 'No'}
          onSelectionChange={(value) => handleInputChange('manglik', value)}
        />

        <SelectField
          label="Marital Status"
          options={[
            { id: 'Never Married', name: 'Never Married', image: '' },
            { id: 'Separated', name: 'Separated', image: '' },
            { id: 'Widowed', name: 'Widowed', image: '' },
            { id: 'Divorced', name: 'Divorced', image: '' },
          ]}
          selectedValue={maritalStatus}
          onSelectionChange={(value) => handleInputChange('maritalStatus', value)}
        />

        <SelectField
          label="Blood Group (optional)"
          options={[
            { id: 'A+', name: 'A+', image: '' },
            { id: 'A-', name: 'A-', image: '' },
            { id: 'B+', name: 'B+', image: '' },
            { id: 'B-', name: 'B-', image: '' },
            { id: 'AB+', name: 'AB+', image: '' },
            { id: 'AB-', name: 'AB-', image: '' },
            { id: 'O+', name: 'O+', image: '' },
            { id: 'O-', name: 'O-', image: '' },
          ]}
          selectedValue={bloodGroup}
          onSelectionChange={(value) => handleInputChange('bloodGroup', value)}
        />
      </>
    </RenderSection>
  );
}

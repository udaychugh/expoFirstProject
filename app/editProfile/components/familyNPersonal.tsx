import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

interface Sibling {
  id: string;
  name: string;
  maritalStatus: string;
}

export default function FamilyAndPersonal() {
  const { profile, updateProfile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [fatherName, setFatherName] = useState(
    profile?.familyDetails?.fatherName ?? '',
  );
  const [fatherOccupation, setFatherOccupation] = useState(
    profile?.familyDetails?.fatherOccupation ?? '',
  );
  const [motherName, setMotherName] = useState(
    profile?.familyDetails?.motherName ?? '',
  );
  const [motherOccupation, setMotherOccupation] = useState(
    profile?.familyDetails?.motherOccupation ?? '',
  );
  const [familyIncome, setFamilyIncome] = useState(
    profile?.familyDetails?.familyIncome ?? '',
  );
  const [createdBy, setCreatedBy] = useState(
    profile?.familyDetails?.createdBy ?? '',
  );
  const [siblings, setSiblings] = useState<Sibling[]>(
    profile?.familyDetails?.siblings ?? [],
  );

  const handleInputChange = (field: string, value: string) => {
    setAction('Save');
    switch (field) {
      case 'fatherName':
        setFatherName(value);
        break;
      case 'fatherOccupation':
        setFatherOccupation(value);
        break;
      case 'motherName':
        setMotherName(value);
        break;
      case 'motherOccupation':
        setMotherOccupation(value);
        break;
      case 'familyIncome':
        setFamilyIncome(value);
        break;
      case 'createdBy':
        setCreatedBy(value);
        break;
    }
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const updateData = {
        fatherName: fatherName,
        motherName: motherName,
        fatherOccupation: fatherOccupation,
        motherOccupation: motherOccupation,
        familyIncome: familyIncome,
        createdBy: createdBy,
        siblings: profile?.familyDetails?.siblings ?? [],
      };
      const response = await ApiService.updateFamilyDetails(updateData);

      if (response.success) {
        setAction('');
        updateProfile({ familyDetails: updateData });
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Family details updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update family details',
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
      title="Family Details"
      isExpanded={false}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <ProfileInput
          label="Father's Name"
          placeholder="Father's Name"
          presetValue={profile?.familyDetails?.fatherName}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Father's Occupation"
          placeholder="Father's Occupation"
          presetValue={profile?.familyDetails?.fatherOccupation}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Mother's Name"
          placeholder="Mother's Name"
          presetValue={profile?.familyDetails?.motherName}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Mother's Occupation"
          placeholder="Mother's Occupation"
          presetValue={profile?.familyDetails?.motherOccupation}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Family Income"
          placeholder="Family Income"
          presetValue={profile?.familyDetails?.familyIncome}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Created By"
          placeholder="Created By"
          presetValue={profile?.familyDetails?.createdBy}
          onChange={(value) => handleInputChange('description', value)}
        />
      </>
    </RenderSection>
  );
}

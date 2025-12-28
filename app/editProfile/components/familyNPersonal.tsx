import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';

export default function FamilyAndPersonal() {
  const { profile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [fatherName, setFatherName] = useState(profile?.family?.fatherName);
  const [fatherOccupation, setFatherOccupation] = useState(
    profile?.family?.fatherOccupation
  );
  const [motherName, setMotherName] = useState(profile?.family?.motherName);
  const [motherOccupation, setMotherOccupation] = useState(
    profile?.family?.motherOccupation
  );
  const [familyIncome, setFamilyIncome] = useState(
    profile?.family?.familyIncome
  );
  const [createdBy, setCreatedBy] = useState(profile?.family?.createdBy);

  const handleInputChange = (field: string, value: string) => {
    setAction('save');
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

  const handleSaveAction = () => {
    setLoading(true);
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
          presetValue={profile?.family?.fatherName}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Father's Occupation"
          placeholder="Father's Occupation"
          presetValue={profile?.family?.fatherOccupation}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Mother's Name"
          placeholder="Mother's Name"
          presetValue={profile?.family?.motherName}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Mother's Occupation"
          placeholder="Mother's Occupation"
          presetValue={profile?.family?.motherOccupation}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Family Income"
          placeholder="Family Income"
          presetValue={profile?.family?.familyIncome}
          onChange={(value) => handleInputChange('description', value)}
        />

        <ProfileInput
          label="Created By"
          placeholder="Created By"
          presetValue={profile?.family?.createdBy}
          onChange={(value) => handleInputChange('description', value)}
        />
      </>
    </RenderSection>
  );
}

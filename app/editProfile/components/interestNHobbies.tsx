import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import { useAuth } from '@/contexts/AuthContext';
import SelectList from '@/app/(onboarding)/components/selectList';
import {
  HOBBIES,
  LANGUAGES,
  SPORTS_FITNESS,
} from '@/app/(onboarding)/models/interests';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function InterestsAndHobbies() {
  const { profile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [hobbies, setHobbies] = useState<string[]>(profile?.hobbies || []);
  const [sportsAndFitness, setSportsAndFitness] = useState<string[]>(
    profile?.sportsAndFitness || []
  );
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(
    profile?.languagesSpoken || []
  );

  const updateState = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string[]
  ) => {
    setAction('save');
    setter(value);
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const response = await ApiService.updateInterests({
        hobbies: hobbies,
        sportsAndFitness: sportsAndFitness,
        languagesSpoken: languagesSpoken,
      });

      if (response.success) {
        setAction('');
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Interests and hobbies updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update interests',
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
      title="Interests & Hobbies"
      isExpanded={false}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <SelectList
          title="Hobbies & Interests"
          listData={HOBBIES}
          setItemData={(value) => updateState(setHobbies, value)}
          preSelectedData={hobbies}
        />

        <SelectList
          title="Sports & Fitness"
          listData={SPORTS_FITNESS}
          setItemData={(value) => updateState(setSportsAndFitness, value)}
          preSelectedData={sportsAndFitness}
        />

        <SelectList
          title="Languages Spoken"
          listData={LANGUAGES}
          setItemData={(value) => updateState(setLanguagesSpoken, value)}
          preSelectedData={languagesSpoken}
        />
      </>
    </RenderSection>
  );
}

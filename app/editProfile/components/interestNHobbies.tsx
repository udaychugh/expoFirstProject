import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import { useAuth } from '@/contexts/AuthContext';
import SelectList from '@/app/(onboarding)/components/selectList';
import {
  HOBBIES,
  LANGUAGES,
  SPORTS_FITNESS,
} from '@/app/(onboarding)/models/interests';

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

  const handleSaveAction = () => {
    setLoading(true);
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
          setItemData={setHobbies}
          preSelectedData={hobbies}
        />

        <SelectList
          title="Sports & Fitness"
          listData={SPORTS_FITNESS}
          setItemData={setSportsAndFitness}
          preSelectedData={sportsAndFitness}
        />

        <SelectList
          title="Languages Spoken"
          listData={LANGUAGES}
          setItemData={setLanguagesSpoken}
          preSelectedData={languagesSpoken}
        />
      </>
    </RenderSection>
  );
}

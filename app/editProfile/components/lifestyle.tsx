import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import { useAuth } from '@/contexts/AuthContext';
import { SelectField } from './core/selectField';

export default function LifeStyle() {
  const { profile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [diet, setDiet] = useState(profile?.diet ?? '');
  const [drinkingHabit, setDrinkingHabit] = useState(
    profile?.drinkingHabit ?? ''
  );
  const [smokingHabit, setSmokingHabit] = useState(profile?.smokingHabit ?? '');

  const handleInputChange = (field: string, value: string) => {
    setAction('save');
    switch (field) {
      case 'diet':
        setDiet(value);
        break;
      case 'drinkingHabit':
        setDrinkingHabit(value);
        break;
      case 'smokingHabit':
        setSmokingHabit(value);
        break;
    }
  };

  const handleSaveAction = () => {
    setLoading(true);
  };

  return (
    <RenderSection
      title="Lifestyle"
      isExpanded={false}
      action={action}
      loading={loading}
      onActionClick={handleSaveAction}
    >
      <>
        <SelectField
          label="Diet Preference"
          options={[
            { id: '1', name: 'Vegetarian', image: '' },
            { id: '2', name: 'Eggetarian', image: '' },
            { id: '3', name: 'Non-vegetarian', image: '' },
            { id: '4', name: 'Jain', image: '' },
            { id: '5', name: 'Vegan', image: '' },
          ]}
          selectedValue={diet}
          onSelectionChange={(value) => handleInputChange('diet', value)}
        />

        <SelectField
          label="Drinking Habit"
          options={[
            { id: '1', name: 'No', image: '' },
            { id: '2', name: 'Regular', image: '' },
            { id: '3', name: 'Occasional', image: '' },
          ]}
          selectedValue={drinkingHabit}
          onSelectionChange={(value) =>
            handleInputChange('drinkingHabit', value)
          }
        />

        <SelectField
          label="Smoking Habit"
          options={[
            { id: '1', name: 'No', image: '' },
            { id: '2', name: 'Regular', image: '' },
            { id: '3', name: 'Occasional', image: '' },
          ]}
          selectedValue={smokingHabit}
          onSelectionChange={(value) =>
            handleInputChange('smokingHabit', value)
          }
        />
      </>
    </RenderSection>
  );
}

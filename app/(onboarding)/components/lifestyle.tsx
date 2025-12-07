import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { profileStyles } from './styles';
import PrimaryButton from '@/components/PrimaryButton';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import SelectBtns from './selectBtn';

export default function LifeStyle({ handleNext }: { handleNext: () => void }) {
  // Lifestyle states
  const [diet, setDiet] = useState('');
  const [drinkingHabit, setDrinkingHabit] = useState('');
  const [smokingHabit, setSmokingHabit] = useState('');

  const [isLoading, setLoading] = useState(false);

  const handleSaveButton = async () => {
    setLoading(true);

    if (!diet) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Diet is required',
      });
      return;
    }

    if (!drinkingHabit) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Drinking Habit is required',
      });
      return;
    }

    if (!smokingHabit) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Smoking Habit is required',
      });
      return;
    }

    try {
      const response = await ApiService.updateLifestyle({
        diet: diet,
        drinkingHabit: drinkingHabit,
        smokingHabit: smokingHabit,
      });

      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Profile Updated Successfully',
        });
        handleNext();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Failed to Update Profile',
        });
      }
    } catch (error) {
      console.log(error);
      ShowAlert({
        type: 'error',
        title: 'Failed to Update Profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Lifestyle Details</Text>
          <Text style={profileStyles.stepSubtitle}>
            Tell us about your lifestyle preferences
          </Text>

          <View style={profileStyles.form}>
            <SelectBtns
              title="Diet Preference"
              list={[
                'Vegetarian',
                'Eggetarian',
                'Non-vegetarian',
                'Jain',
                'Vegan',
              ]}
              onPress={(value) => {
                setDiet(value);
              }}
            />

            <SelectBtns
              title="Drinking Habit"
              list={['No', 'Occasional', 'Regular']}
              onPress={(value) => {
                setDrinkingHabit(value);
              }}
            />

            <SelectBtns
              title="Smoking Habit"
              list={['No', 'Occasional', 'Regular']}
              onPress={(value) => {
                setSmokingHabit(value);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={isLoading ? 'Saving...' : 'Save & Continue'}
        enabled={!isLoading}
        onPress={handleSaveButton}
      />
    </>
  );
}

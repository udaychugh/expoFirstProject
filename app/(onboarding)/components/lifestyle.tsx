import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';

export default function LifeStyle({ handleNext }: { handleNext: () => void }) {
  // Lifestyle states
  const [diet, setDiet] = useState('');
  const [drinkingHabit, setDrinkingHabit] = useState('');
  const [smokingHabit, setSmokingHabit] = useState('');

  const [isLoading, setLoading] = useState(false);

  const handleSaveButton = () => {
    // TODO: Implement save functionality
    console.log({
      diet,
      drinkingHabit,
      smokingHabit,
    });
    handleNext();
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
            {/* Lifestyle Section */}
            <View style={styles.section}>
              {/* Diet */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Diet Preference</Text>
                <View style={profileStyles.optionsGrid}>
                  {[
                    'Vegetarian',
                    'Eggetarian',
                    'Non-vegetarian',
                    'Jain',
                    'Vegan',
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        profileStyles.gridOption,
                        diet === option && profileStyles.selectedOption,
                      ]}
                      onPress={() => setDiet(option)}
                    >
                      <Text
                        style={[
                          profileStyles.optionText,
                          diet === option && profileStyles.selectedOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Drinking Habit */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Drinking Habit</Text>
                <View style={profileStyles.optionsGrid}>
                  {['No', 'Occasional', 'Regular'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        profileStyles.gridOption,
                        drinkingHabit === option &&
                          profileStyles.selectedOption,
                      ]}
                      onPress={() => setDrinkingHabit(option)}
                    >
                      <Text
                        style={[
                          profileStyles.optionText,
                          drinkingHabit === option &&
                            profileStyles.selectedOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Smoking Habit */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Smoking Habit</Text>
                <View style={profileStyles.optionsGrid}>
                  {['No', 'Occasional', 'Regular'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        profileStyles.gridOption,
                        smokingHabit === option && profileStyles.selectedOption,
                      ]}
                      onPress={() => setSmokingHabit(option)}
                    >
                      <Text
                        style={[
                          profileStyles.optionText,
                          smokingHabit === option &&
                            profileStyles.selectedOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
});

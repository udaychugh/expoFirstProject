import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import Slider from '@react-native-community/slider';

export default function FamilyDetail({
  handleNext,
}: {
  handleNext: () => void;
}) {
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [noOfBrothers, setNoOfBrothers] = useState(0);
  const [noOfSisters, setNoOfSisters] = useState(0);
  const [createdBy, setCreatedBy] = useState('');

  const [isLoading, setLoading] = useState(false);

  const handleSaveButton = () => {
    // TODO: Implement save functionality
    console.log({
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      noOfBrothers,
      noOfSisters,
      createdBy,
    });
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Family Details</Text>
          <Text style={profileStyles.stepSubtitle}>
            Tell us about your family
          </Text>

          <View style={profileStyles.form}>
            <View style={styles.section}>
              {/* Father Name */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Father's Name</Text>
                <TextInput
                  style={profileStyles.input}
                  value={fatherName}
                  onChangeText={setFatherName}
                  placeholder="Enter father's name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Mother Name */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Mother's Name</Text>
                <TextInput
                  style={profileStyles.input}
                  value={motherName}
                  onChangeText={setMotherName}
                  placeholder="Enter mother's name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Father Occupation */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Father's Occupation</Text>
                <TextInput
                  style={profileStyles.input}
                  value={fatherOccupation}
                  onChangeText={setFatherOccupation}
                  placeholder="Enter father's occupation"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Mother Occupation */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Mother's Occupation</Text>
                <TextInput
                  style={profileStyles.input}
                  value={motherOccupation}
                  onChangeText={setMotherOccupation}
                  placeholder="Enter mother's occupation"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Number of Brothers */}
              <View style={profileStyles.inputGroup}>
                <View style={styles.sliderHeader}>
                  <Text style={profileStyles.label}>Number of Brothers</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{noOfBrothers}</Text>
                  </View>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={noOfBrothers}
                  onValueChange={setNoOfBrothers}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor={Colors.primary}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>0</Text>
                  <Text style={styles.sliderLabel}>10</Text>
                </View>
              </View>

              {/* Number of Sisters */}
              <View style={profileStyles.inputGroup}>
                <View style={styles.sliderHeader}>
                  <Text style={profileStyles.label}>Number of Sisters</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{noOfSisters}</Text>
                  </View>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={noOfSisters}
                  onValueChange={setNoOfSisters}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor={Colors.primary}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>0</Text>
                  <Text style={styles.sliderLabel}>10</Text>
                </View>
              </View>

              {/* Created By */}
              <View style={[profileStyles.inputGroup, { marginBottom: 20 }]}>
                <Text style={profileStyles.label}>Created By</Text>
                <View style={profileStyles.optionsGrid}>
                  {[
                    'Father',
                    'Mother',
                    'Elder Brother',
                    'Elder Sister',
                    'Self',
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        profileStyles.gridOption,
                        createdBy === option && profileStyles.selectedOption,
                      ]}
                      onPress={() => setCreatedBy(option)}
                    >
                      <Text
                        style={[
                          profileStyles.optionText,
                          createdBy === option &&
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
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

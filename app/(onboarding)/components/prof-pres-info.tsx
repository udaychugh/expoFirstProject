import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { profileStyles } from './styles';

export default function ProfessionalPersonaInfo({
  handleInputChange,
}: {
  handleInputChange: (field: string, value: string) => void;
}) {
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [height, setHeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');

  return (
    <View style={profileStyles.stepContent}>
      <Text style={profileStyles.stepTitle}>Professional & Personal</Text>
      <Text style={profileStyles.stepSubtitle}>
        Help others know you better
      </Text>

      <View style={profileStyles.form}>
        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Occupation</Text>
          <TextInput
            style={profileStyles.input}
            value={occupation}
            onChangeText={(value) => {
              setOccupation(value);
              handleInputChange('occupation', value);
            }}
            placeholder="What do you do for work?"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Education</Text>
          <TextInput
            style={profileStyles.input}
            value={education}
            onChangeText={(value) => {
              setEducation(value);
              handleInputChange('education', value);
            }}
            placeholder="Your highest qualification"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Height</Text>
          <TextInput
            style={profileStyles.input}
            value={height}
            onChangeText={(value) => {
              setHeight(value);
              handleInputChange('height', value);
            }}
            placeholder={`e.g., 5'6"`}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Marital Status</Text>
          <View style={profileStyles.optionsColumn}>
            {['Never Married', 'Divorced', 'Widowed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  profileStyles.option,
                  maritalStatus === status && profileStyles.selectedOption,
                ]}
                onPress={() => {
                  setMaritalStatus(status);
                  handleInputChange('maritalStatus', status);
                }}
              >
                <Text
                  style={[
                    profileStyles.optionText,
                    maritalStatus === status &&
                      profileStyles.selectedOptionText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

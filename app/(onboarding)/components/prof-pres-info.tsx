import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { profileStyles } from './styles';
import { MapPin } from 'lucide-react-native';

export default function ProfessionalPersonaInfo({
  handleInputChange,
}: {
  handleInputChange: (field: string, value: string) => void;
}) {
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  return (
    <View style={profileStyles.stepContent}>
      <Text style={profileStyles.stepTitle}>Professional & Personal</Text>
      <Text style={profileStyles.stepSubtitle}>
        Help others know you better
      </Text>

      <View style={profileStyles.form}>
        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>About Me</Text>
          <TextInput
            style={[profileStyles.input, profileStyles.textArea]}
            value={bio}
            onChangeText={(value) => {
              setBio(value);
              handleInputChange('bio', value);
            }}
            placeholder="Tell others about yourself, your interests, and what you're looking for..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={profileStyles.inputGroup}>
          <View style={profileStyles.inputGroup}>
            <Text style={profileStyles.label}>Location</Text>
            <View style={profileStyles.inputWithIcon}>
              <MapPin color="#9CA3AF" size={20} />
              <TextInput
                style={profileStyles.inputText}
                value={location}
                onChangeText={(value) => {
                  setLocation(value);
                  handleInputChange('location', value);
                }}
                placeholder="City, State"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

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
      </View>
    </View>
  );
}

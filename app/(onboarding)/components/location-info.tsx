import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { profileStyles } from './styles';
import { MapPin } from 'lucide-react-native';

export default function LocationAboutInfo({
  handleInputChange,
}: {
  handleInputChange: (field: string, value: string) => void;
}) {
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  return (
    <View style={profileStyles.stepContent}>
      <Text style={profileStyles.stepTitle}>Location & About</Text>
      <Text style={profileStyles.stepSubtitle}>
        Final details to complete your profile
      </Text>

      <View style={profileStyles.form}>
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
      </View>
    </View>
  );
}

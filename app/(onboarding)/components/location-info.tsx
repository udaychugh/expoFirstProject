import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { profileStyles } from './styles';

export default function LocationAboutInfo({
  handleInputChange,
}: {
  handleInputChange: (field: string, value: string) => void;
}) {
  return (
    <View style={profileStyles.stepContent}>
      <Text style={profileStyles.stepTitle}>Location & About</Text>
      <Text style={profileStyles.stepSubtitle}>
        Final details to complete your profile
      </Text>

      <View style={profileStyles.form}></View>
    </View>
  );
}

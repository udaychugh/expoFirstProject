import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { profileStyles } from './styles';

export default function SelectBtns({
  title,
  list,
  onPress,
}: {
  title: string;
  list: string[];
  onPress: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  const handlePress = (v: string) => {
    setValue(v);
    onPress(v);
  };

  return (
    <View style={profileStyles.inputGroup}>
      <Text style={profileStyles.label}>{title}</Text>
      <View style={profileStyles.optionsGrid}>
        {list.map((group) => (
          <Pressable
            key={group}
            style={[
              profileStyles.gridOption,
              value === group && profileStyles.selectedOption,
            ]}
            onPress={() => {
              handlePress(group);
            }}
          >
            <Text
              style={[
                profileStyles.optionText,
                value === group && profileStyles.selectedOptionText,
              ]}
            >
              {group}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { profileStyles } from './styles';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/assets/colors/colors';
import { Image } from 'expo-image';
import InputBox from '@/components/InputBox';

export default function BasicInfoSetup({
  handleInputChange,
}: {
  handleInputChange: (field: string, value: string) => void;
}) {
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');

  // Calculate maximum date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      // Format date as DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setFormattedDate(`${day}/${month}/${year}`);
      handleInputChange('dateOfBirth', formattedDate);
    }

    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const RELIGIONS = [
    {
      id: 'Hindu',
      name: 'Hindu',
      image: 'https://cdn-icons-png.flaticon.com/512/1533/1533913.png',
    },
    {
      id: 'Christian',
      name: 'Christian',
      image: 'https://cdn-icons-png.flaticon.com/512/3004/3004024.png',
    },
    {
      id: 'Sikh',
      name: 'Sikh',
      image: 'https://cdn-icons-png.flaticon.com/512/1533/1533924.png',
    },
    {
      id: 'Muslim',
      name: 'Muslim',
      image: 'https://cdn-icons-png.flaticon.com/512/4357/4357434.png',
    },
    {
      id: 'Buddhist',
      name: 'Buddhist',
      image: 'https://cdn-icons-png.flaticon.com/512/1533/1533908.png',
    },
    {
      id: 'Jain',
      name: 'Jain',
      image: 'https://cdn-icons-png.flaticon.com/512/1533/1533918.png',
    },
    {
      id: 'Other',
      name: 'Other',
      image: 'https://cdn-icons-png.flaticon.com/512/10412/10412463.png',
    },
  ];

  return (
    <View style={profileStyles.stepContent}>
      <Text style={profileStyles.stepTitle}>Basic Information</Text>
      <Text style={profileStyles.stepSubtitle}>Tell us about yourself</Text>

      <View style={profileStyles.form}>
        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Gender</Text>
          <View style={profileStyles.optionsRow}>
            <TouchableOpacity
              style={[
                profileStyles.option,
                gender === 'Male' && profileStyles.selectedOption,
              ]}
              onPress={() => {
                setGender('Male');
                handleInputChange('gender', 'Male');
              }}
            >
              <Text
                style={[
                  profileStyles.optionText,
                  gender === 'Male' && profileStyles.selectedOptionText,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                profileStyles.option,
                gender === 'Female' && profileStyles.selectedOption,
              ]}
              onPress={() => {
                setGender('Female');
                handleInputChange('gender', 'Female');
              }}
            >
              <Text
                style={[
                  profileStyles.optionText,
                  gender === 'Female' && profileStyles.selectedOptionText,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={profileStyles.inputWithIcon}
            onPress={openDatePicker}
          >
            <Calendar color="#9CA3AF" size={20} />
            <Text
              style={[
                profileStyles.inputText,
                !formattedDate && profileStyles.placeholderText,
              ]}
            >
              {formattedDate || 'DD/MM/YYYY'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || getMaxDate()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={getMaxDate()}
              minimumDate={new Date(1950, 0, 1)}
              accentColor={Colors.primary}
              textColor={Colors.primary}
            />
          )}
        </View>

        <View style={profileStyles.inputGroup}>
          <Text style={profileStyles.label}>Religion</Text>
          <View style={profileStyles.religionGrid}>
            {RELIGIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  profileStyles.religionCard,
                  religion === item.name && profileStyles.selectedReligionCard,
                ]}
                onPress={() => {
                  setReligion(item.name);
                  handleInputChange('religion', item.name);
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={profileStyles.religionIcon}
                  contentFit="contain"
                />
                <Text
                  style={[
                    profileStyles.religionText,
                    religion === item.name &&
                      profileStyles.selectedReligionText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={profileStyles.inputGroup}>
          <InputBox
            label="Caste/Community"
            placeholder="Enter your caste/community"
            value={caste}
            icon={undefined}
            onChangeText={(value) => {
              setCaste(value);
              handleInputChange('caste', value);
            }}
          />
        </View>
      </View>
    </View>
  );
}

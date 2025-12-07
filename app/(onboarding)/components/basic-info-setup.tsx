import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { profileStyles } from './styles';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/assets/colors/colors';
import { Image } from 'expo-image';
import InputOutlineBox from '@/components/InputOutlineBox';
import PrimaryButton from '@/components/PrimaryButton';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import { RELIGIONS } from '../models/religions';
import SelectBtns from './selectBtn';

export default function BasicInfoSetup({
  handleNext,
}: {
  handleNext: () => void;
}) {
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [height, setHeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [isLoading, setLoading] = useState(false);

  const handleSaveButton = async () => {
    setLoading(true);

    if (!gender) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Gender',
      });
      return;
    }

    if (!formattedDate) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Date of Birth',
      });
      return;
    }

    if (!religion) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Religion',
      });
      return;
    }

    if (!caste) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Caste',
      });
      return;
    }

    if (!height) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Height',
      });
      return;
    }

    if (!maritalStatus) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Marital Status',
      });
      return;
    }

    try {
      const response = await ApiService.updatePersonalDetails({
        age: formattedDate,
        gender: gender,
        religion: religion,
        caste: caste,
        height: height,
        maritalStatus: maritalStatus,
        bloodGroup: bloodGroup,
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
      ShowAlert({
        type: 'error',
        title: 'Failed to Update Profile',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    }

    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Personal Details</Text>
          <Text style={profileStyles.stepSubtitle}>Tell us about yourself</Text>

          <View style={profileStyles.form}>
            <SelectBtns
              title="Gender"
              list={['Male', 'Female']}
              onPress={(value) => {
                setGender(value);
              }}
            />

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Date of Birth</Text>
              <Pressable
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
              </Pressable>

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
              <InputOutlineBox
                label="Height"
                value={height}
                onChangeText={(value) => {
                  setHeight(value);
                }}
                placeholder={`e.g., 5'6"`}
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Religion</Text>
              <View style={profileStyles.religionGrid}>
                {RELIGIONS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      profileStyles.religionCard,
                      religion === item.name &&
                        profileStyles.selectedReligionCard,
                    ]}
                    onPress={() => {
                      setReligion(item.name);
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

            <View style={[profileStyles.inputGroup]}>
              <InputOutlineBox
                label="Caste/Community"
                placeholder="Enter your caste/community"
                value={caste}
                onChangeText={(value) => {
                  setCaste(value);
                }}
              />
            </View>

            <SelectBtns
              title="Marital Status"
              list={['Never Married', 'Divorced', 'Widowed', 'Separated']}
              onPress={(value) => {
                setMaritalStatus(value);
              }}
            />

            <SelectBtns
              title="Blood Group"
              list={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              onPress={(value) => {
                setBloodGroup(value);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={isLoading ? 'Saving...' : 'Save Info'}
        enabled={!isLoading}
        onPress={handleSaveButton}
      />
    </>
  );
}

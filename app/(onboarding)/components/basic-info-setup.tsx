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
  const [apiDate, setApiDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [formattedTime, setFormattedTime] = useState('');
  const [apiTime, setApiTime] = useState('');
  const [rememberBirthTime, setRememberBirthTime] = useState(true);
  const [manglik, setManglik] = useState('');
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

    if (rememberBirthTime && !formattedTime) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Time of Birth',
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
        dateOfBirth: apiDate,
        timeOfBirth: rememberBirthTime ? apiTime : undefined,
        gender: gender,
        manglik: manglik,
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
      setApiDate(`${year}-${month}-${day}`);
    }

    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (time) {
      setSelectedTime(time);
      // Format time as HH:MM:SS
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const seconds = String(time.getSeconds()).padStart(2, '0');
      setFormattedTime(`${hours}:${minutes}:${seconds}`);
      setApiTime(`${hours}:${minutes}:${seconds}`);
    }

    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
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
              <Text style={profileStyles.label}>Time of Birth</Text>
              <Pressable
                style={[
                  profileStyles.inputWithIcon,
                  !rememberBirthTime && { opacity: 0.5 },
                ]}
                onPress={openTimePicker}
                disabled={!rememberBirthTime}
              >
                <Calendar color="#9CA3AF" size={20} />
                <Text
                  style={[
                    profileStyles.inputText,
                    !formattedTime && profileStyles.placeholderText,
                  ]}
                >
                  {formattedTime || 'HH:MM:SS'}
                </Text>
              </Pressable>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  accentColor={Colors.primary}
                  textColor={Colors.primary}
                  is24Hour={true}
                />
              )}

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 12,
                }}
                onPress={() => {
                  setRememberBirthTime(!rememberBirthTime);
                  if (rememberBirthTime) {
                    setFormattedTime('');
                    setApiTime('');
                    setSelectedTime(undefined);
                  }
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    borderRadius: 4,
                    marginRight: 8,
                    backgroundColor: !rememberBirthTime
                      ? Colors.primary
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {!rememberBirthTime && (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  I don't remember my time of birth
                </Text>
              </Pressable>
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

            <SelectBtns
              title="Manglik"
              list={['Manglik', 'Non-Manglik']}
              onPress={(value) => {
                setManglik(value);
              }}
            />

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

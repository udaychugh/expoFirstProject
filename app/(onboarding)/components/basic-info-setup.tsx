import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { profileStyles } from './styles';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/assets/colors/colors';
import { Image } from 'expo-image';
import InputBox from '@/components/InputBox';
import PrimaryButton from '@/components/PrimaryButton';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import { router } from 'expo-router';

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
  const [weight, setWeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [complexion, setComplexion] = useState('');

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

    if (!weight) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Weight',
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

    if (!bloodGroup) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Blood Group',
      });
      return;
    }

    if (!bodyType) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Body Type',
      });
      return;
    }

    if (!complexion) {
      setLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Please Select your Complexion',
      });
      return;
    }

    try {
      const response = await ApiService.updatePersonalDetails({
        age: formattedDate,
        gender,
        religion,
        caste,
        height,
        weight,
        maritalStatus,
        bloodGroup,
        bodyType,
        complexion,
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
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Personal Details</Text>
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
              <Text style={profileStyles.label}>Height</Text>
              <TextInput
                style={profileStyles.input}
                value={height}
                onChangeText={(value) => {
                  setHeight(value);
                }}
                placeholder={`e.g., 5'6"`}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Weight</Text>
              <TextInput
                style={profileStyles.input}
                value={weight}
                onChangeText={(value) => {
                  setWeight(value);
                }}
                placeholder={`e.g., 60 KG`}
                placeholderTextColor="#9CA3AF"
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

            <View style={[profileStyles.inputGroup, { marginVertical: -20 }]}>
              <InputBox
                label="Caste/Community"
                placeholder="Enter your caste/community"
                value={caste}
                icon={undefined}
                onChangeText={(value) => {
                  setCaste(value);
                }}
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Marital Status</Text>
              <View style={profileStyles.optionsGrid}>
                {['Never Married', 'Divorced', 'Widowed', 'Separated'].map(
                  (status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        profileStyles.gridOption,
                        maritalStatus === status &&
                          profileStyles.selectedOption,
                      ]}
                      onPress={() => {
                        setMaritalStatus(status);
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
                  )
                )}
              </View>
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Blood Group</Text>
              <View style={profileStyles.optionsGrid}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                  (group) => (
                    <TouchableOpacity
                      key={group}
                      style={[
                        profileStyles.gridOption,
                        bloodGroup === group && profileStyles.selectedOption,
                      ]}
                      onPress={() => {
                        setBloodGroup(group);
                      }}
                    >
                      <Text
                        style={[
                          profileStyles.optionText,
                          bloodGroup === group &&
                            profileStyles.selectedOptionText,
                        ]}
                      >
                        {group}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Body Type</Text>
              <View style={profileStyles.optionsGrid}>
                {['Slim', 'Athletic', 'Average', 'Chubby'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      profileStyles.gridOption,
                      bodyType === type && profileStyles.selectedOption,
                    ]}
                    onPress={() => {
                      setBodyType(type);
                    }}
                  >
                    <Text
                      style={[
                        profileStyles.optionText,
                        bodyType === type && profileStyles.selectedOptionText,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[profileStyles.inputGroup, { marginBottom: 20 }]}>
              <Text style={profileStyles.label}>Complexion</Text>
              <View style={profileStyles.optionsGrid}>
                {['Very Fair', 'Fair', 'Wheatish', 'Dark'].map((tone) => (
                  <TouchableOpacity
                    key={tone}
                    style={[
                      profileStyles.gridOption,
                      complexion === tone && profileStyles.selectedOption,
                    ]}
                    onPress={() => {
                      setComplexion(tone);
                    }}
                  >
                    <Text
                      style={[
                        profileStyles.optionText,
                        complexion === tone && profileStyles.selectedOptionText,
                      ]}
                    >
                      {tone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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

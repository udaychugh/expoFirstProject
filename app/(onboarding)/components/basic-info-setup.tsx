import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { profileStyles } from './styles';
import { Calendar, X, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/assets/colors/colors';
import { Image } from 'expo-image';
import InputOutlineBox from '@/components/InputOutlineBox';
import PrimaryButton from '@/components/PrimaryButton';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import { RELIGIONS } from '../models/religions';
import SelectBtns from './selectBtn';
import SelectionPicker from '@/components/SelectionPicker';
import { HEIGHTS, MARITAL_STATUS } from '../models/height';

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
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');
  const [apiTime, setApiTime] = useState('');
  const [rememberBirthTime, setRememberBirthTime] = useState(true);
  const [manglik, setManglik] = useState(false);
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [height, setHeight] = useState('');
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bloodGroup, setBloodGroup] = useState<string | undefined>(undefined);
  const [placeOfBirth, setPlaceOfBirth] = useState('');

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
        placeOfBirth: placeOfBirth,
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
      today.getDate(),
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

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  const closeTimePicker = () => {
    setShowTimePicker(false);
  };

  const handleTimeConfirm = () => {
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    setFormattedTime(`${hoursStr}:${minutesStr}:${secondsStr}`);
    setApiTime(`${hoursStr}:${minutesStr}:${secondsStr}`);
    closeTimePicker();
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

            <View style={[profileStyles.inputGroup, { marginBottom: 10 }]}>
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
                    setHours(0);
                    setMinutes(0);
                    setSeconds(0);
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
                label="Place of birth"
                value={placeOfBirth}
                onChangeText={(value) => {
                  setPlaceOfBirth(value);
                }}
                placeholder={`e.g., Karnal, Haryana`}
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Height</Text>
              <Pressable
                style={profileStyles.inputWithIcon}
                onPress={() => setShowHeightPicker(true)}
              >
                <Text
                  style={[
                    profileStyles.inputText,
                    !height && profileStyles.placeholderText,
                    { flex: 1 },
                  ]}
                >
                  {height || `e.g., 5'6"`}
                </Text>
                <ChevronDown color="#9CA3AF" size={20} />
              </Pressable>
            </View>

            <SelectBtns
              title="Manglik"
              list={['Manglik', 'Non-Manglik']}
              onPress={(value) => {
                if (value == 'Manglik') {
                  setManglik(true);
                } else {
                  setManglik(false);
                }
              }}
            />

            <SelectBtns
              title="Religion"
              list={RELIGIONS.map((item) => item.name)}
              onPress={(value) => {
                setReligion(value);
              }}
            />

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
              list={MARITAL_STATUS}
              onPress={(value) => {
                setMaritalStatus(value);
              }}
            />

            <SelectBtns
              title="Blood Group (optional)"
              list={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              onPress={(value) => {
                setBloodGroup(value);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={'Save Info'}
        enabled={!isLoading}
        isLoading={isLoading}
        onPress={handleSaveButton}
      />

      {/* Height Selection Picker */}
      <SelectionPicker
        visible={showHeightPicker}
        title="Select Height"
        options={HEIGHTS}
        selected={height}
        onSelect={(value) => setHeight(value)}
        onClose={() => setShowHeightPicker(false)}
      />

      {/* Custom Time Picker Bottom Sheet Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={closeTimePicker}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={closeTimePicker}
        >
          <Pressable
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 40,
              maxHeight: '70%',
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#111827',
                }}
              >
                Select Birth Time
              </Text>
              <TouchableOpacity onPress={closeTimePicker}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            {/* Number Pickers */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 30,
                paddingHorizontal: 20,
                gap: 12,
              }}
            >
              {/* Hours Picker */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    marginBottom: 8,
                    fontWeight: '600',
                  }}
                >
                  Hours
                </Text>
                <ScrollView
                  style={{
                    height: 200,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => setHours(hour)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor:
                          hours === hour ? Colors.primary : 'transparent',
                        borderRadius: 8,
                        marginVertical: 2,
                        marginHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: hours === hour ? 'bold' : 'normal',
                          color: hours === hour ? 'white' : '#374151',
                          textAlign: 'center',
                        }}
                      >
                        {String(hour).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}
              >
                :
              </Text>

              {/* Minutes Picker */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    marginBottom: 8,
                    fontWeight: '600',
                  }}
                >
                  Minutes
                </Text>
                <ScrollView
                  style={{
                    height: 200,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => setMinutes(minute)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor:
                          minutes === minute ? Colors.primary : 'transparent',
                        borderRadius: 8,
                        marginVertical: 2,
                        marginHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: minutes === minute ? 'bold' : 'normal',
                          color: minutes === minute ? 'white' : '#374151',
                          textAlign: 'center',
                        }}
                      >
                        {String(minute).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}
              >
                :
              </Text>

              {/* Seconds Picker */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    marginBottom: 8,
                    fontWeight: '600',
                  }}
                >
                  Seconds
                </Text>
                <ScrollView
                  style={{
                    height: 200,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((second) => (
                    <TouchableOpacity
                      key={second}
                      onPress={() => setSeconds(second)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor:
                          seconds === second ? Colors.primary : 'transparent',
                        borderRadius: 8,
                        marginVertical: 2,
                        marginHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: seconds === second ? 'bold' : 'normal',
                          color: seconds === second ? 'white' : '#374151',
                          textAlign: 'center',
                        }}
                      >
                        {String(second).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={closeTimePicker}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  backgroundColor: 'white',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTimeConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: Colors.primary,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';
import { RELIGIONS } from '@/app/(onboarding)/models/religions';
import { SelectField } from './core/selectField';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import { Colors } from '@/assets/colors/colors';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function PhysicalAttr() {
  const { profile, updateProfile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    profile?.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
  );
  const [dob, setDob] = useState(profile?.dateOfBirth?.split('T')[0] ?? '');
  const [formattedDate, setFormattedDate] = useState(() => {
    if (profile?.dateOfBirth) {
      const date = new Date(profile.dateOfBirth);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  });

  // Time picker states
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeOfBirth, setTimeOfBirth] = useState(profile?.timeOfBirth ?? '');
  const [hours, setHours] = useState(() => {
    if (profile?.timeOfBirth) {
      return parseInt(profile.timeOfBirth.split(':')[0]) || 0;
    }
    return 0;
  });
  const [minutes, setMinutes] = useState(() => {
    if (profile?.timeOfBirth) {
      return parseInt(profile.timeOfBirth.split(':')[1]) || 0;
    }
    return 0;
  });
  const [seconds, setSeconds] = useState(() => {
    if (profile?.timeOfBirth) {
      return parseInt(profile.timeOfBirth.split(':')[2]) || 0;
    }
    return 0;
  });
  const [formattedTime, setFormattedTime] = useState(
    profile?.timeOfBirth ?? '',
  );

  const [placeOfBirth, setPlaceOfBirth] = useState(profile?.placeOfBirth ?? '');
  const [gender, setGender] = useState(profile?.gender ?? '');
  const [religion, setReligion] = useState(profile?.religion ?? '');
  const [caste, setCaste] = useState(profile?.caste ?? '');
  const [height, setHeight] = useState(profile?.height ?? '');
  const [manglik, setManglik] = useState(profile?.manglik ?? false);
  const [maritalStatus, setMaritalStatus] = useState(
    profile?.maritalStatus ?? '',
  );
  const [bloodGroup, setBloodGroup] = useState<string | undefined>(
    profile?.bloodGroup ?? undefined,
  );

  const handleInputChange = (field: string, value: string) => {
    setAction('Save');
    switch (field) {
      case 'dob':
        setDob(value);
        break;
      case 'timeOfBirth':
        setTimeOfBirth(value);
        break;
      case 'placeOfBirth':
        setPlaceOfBirth(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'religion':
        setReligion(value);
        break;
      case 'caste':
        setCaste(value);
        break;
      case 'height':
        setHeight(value);
        break;
      case 'manglik':
        setManglik(value === 'Yes');
        break;
      case 'maritalStatus':
        setMaritalStatus(value);
        break;
      case 'bloodGroup':
        setBloodGroup(value);
        break;
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
      setAction('Save');
      // Format date as DD/MM/YYYY for display
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setFormattedDate(`${day}/${month}/${year}`);
      // Format date as YYYY-MM-DD for API
      setDob(`${year}-${month}-${day}`);
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
    setAction('Save');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    const timeStr = `${hoursStr}:${minutesStr}:${secondsStr}`;
    setFormattedTime(timeStr);
    setTimeOfBirth(timeStr);
    closeTimePicker();
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const updateData = {
        dateOfBirth: dob,
        timeOfBirth: timeOfBirth,
        placeOfBirth: placeOfBirth,
        gender: gender,
        manglik: manglik,
        religion: religion,
        caste: caste,
        maritalStatus: maritalStatus,
        height: height,
        bloodGroup: bloodGroup,
      };
      const response = await ApiService.updatePersonalDetails(updateData);

      if (response.success) {
        setAction('');
        updateProfile(updateData);
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Personal details updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update personal details',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RenderSection
        title="Personal Details"
        isExpanded={false}
        loading={loading}
        action={action}
        onActionClick={handleSaveAction}
      >
        <>
          {/* Date of Birth Picker */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Date of Birth
            </Text>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 14,
                backgroundColor: 'white',
              }}
              onPress={openDatePicker}
            >
              <Calendar color="#9CA3AF" size={20} />
              <Text
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: formattedDate ? '#111827' : '#9CA3AF',
                }}
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

          {/* Time of Birth Picker */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Time of Birth
            </Text>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 14,
                backgroundColor: 'white',
              }}
              onPress={openTimePicker}
            >
              <Calendar color="#9CA3AF" size={20} />
              <Text
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: formattedTime ? '#111827' : '#9CA3AF',
                }}
              >
                {formattedTime || 'HH:MM:SS'}
              </Text>
            </Pressable>
          </View>

          <ProfileInput
            label="Place of Birth"
            placeholder="eg. Karnal, Haryana"
            presetValue={placeOfBirth}
            onChange={(value) => handleInputChange('placeOfBirth', value)}
          />

          <SelectField
            label="Gender"
            options={[
              { id: 'Male', name: 'Male', image: '' },
              { id: 'Female', name: 'Female', image: '' },
            ]}
            selectedValue={gender}
            onSelectionChange={(value) => handleInputChange('gender', value)}
          />

          <SelectField
            label="Religion"
            options={RELIGIONS}
            selectedValue={religion}
            onSelectionChange={(value) => handleInputChange('religion', value)}
          />

          <ProfileInput
            label="Caste"
            placeholder="caste/community"
            presetValue={caste}
            onChange={(value) => handleInputChange('caste', value)}
          />

          <ProfileInput
            label="Height"
            placeholder="e.g., 5'6"
            presetValue={height}
            onChange={(value) => handleInputChange('height', value)}
          />

          <SelectField
            label="Manglik"
            options={[
              { id: 'Yes', name: 'Yes', image: '' },
              { id: 'No', name: 'No', image: '' },
            ]}
            selectedValue={manglik ? 'Yes' : 'No'}
            onSelectionChange={(value) => handleInputChange('manglik', value)}
          />

          <SelectField
            label="Marital Status"
            options={[
              { id: 'Never Married', name: 'Never Married', image: '' },
              { id: 'Separated', name: 'Separated', image: '' },
              { id: 'Widowed', name: 'Widowed', image: '' },
              { id: 'Divorced', name: 'Divorced', image: '' },
            ]}
            selectedValue={maritalStatus}
            onSelectionChange={(value) =>
              handleInputChange('maritalStatus', value)
            }
          />

          <SelectField
            label="Blood Group (optional)"
            options={[
              { id: 'A+', name: 'A+', image: '' },
              { id: 'A-', name: 'A-', image: '' },
              { id: 'B+', name: 'B+', image: '' },
              { id: 'B-', name: 'B-', image: '' },
              { id: 'AB+', name: 'AB+', image: '' },
              { id: 'AB-', name: 'AB-', image: '' },
              { id: 'O+', name: 'O+', image: '' },
              { id: 'O-', name: 'O-', image: '' },
            ]}
            selectedValue={bloodGroup ?? ''}
            onSelectionChange={(value) =>
              handleInputChange('bloodGroup', value)
            }
          />
        </>
      </RenderSection>

      {/* Custom Time Picker Modal */}
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

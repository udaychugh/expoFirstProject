import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { profileStyles } from './styles';
import { ShowAlert } from '@/components/Alert';
import * as Location from 'expo-location';
import { Colors } from '@/assets/colors/colors';
import { MapPin, AlertCircle, X } from 'lucide-react-native';
import PrimaryButton from '@/components/PrimaryButton';
import InputOutlineBox from '@/components/InputOutlineBox';
import ApiService from '@/services/api';

interface LocationData {
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function ProfessionalPersonaInfo({
  handleNext,
}: {
  handleNext: () => void;
}) {
  const [occupation, setOccupation] = useState('');
  const [salary, setSalary] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Job Location states
  const [jobLocation, setJobLocation] = useState('');
  const [sameAsCurrentJob, setSameAsCurrentJob] = useState(false);

  // Permanent Location states
  const [permanentLocation, setPermanentLocation] = useState('');
  const [sameAsCurrentPermanent, setSameAsCurrentPermanent] = useState(false);

  const handleSaveButton = async () => {
    setBtnLoading(true);

    if (!occupation) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Occupation is required',
      });
      return;
    }

    if (!salary) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Salary is required',
      });
      return;
    }

    if (!education) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Education is required',
      });
      return;
    }

    if (!bio) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Bio is required',
      });
      return;
    }

    if (!location) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Location is required',
      });
      return;
    }

    if (!jobLocation) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Job Location is required',
      });
      return;
    }

    if (!permanentLocation) {
      setBtnLoading(false);
      ShowAlert({
        type: 'error',
        title: 'Permanent Location is required',
      });
      return;
    }

    let isNRI = location.country.toLowerCase() != 'india';

    try {
      const response = await ApiService.updateBasicInfo({
        location: location,
        jobLocation: jobLocation,
        permanentLocation: permanentLocation,
        occupation: occupation,
        annualSalary: salary,
        education: education,
        bio: bio,
        isNRI: isNRI,
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
      ShowAlert({
        type: 'error',
        title: 'Failed to Update Profile',
      });
    } finally {
      setBtnLoading(false);
    }
  };

  const handleLocationPress = async () => {
    setIsLoading(true);

    try {
      // Check current permission status
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      let finalStatus = existingStatus;

      // If not granted, request permission
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      // If permission denied, show modal
      if (finalStatus !== 'granted') {
        setIsLoading(false);
        setShowPermissionModal(true);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get address
      const addressData = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressData && addressData.length > 0) {
        const address = addressData[0];

        const locationData: LocationData = {
          city: address.city || address.subregion || '',
          state: address.region || '',
          country: address.country || '',
          coordinates: { latitude, longitude },
        };

        setLocation(locationData);

        ShowAlert({
          type: 'success',
          title: 'Location Fetched Successfully',
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      ShowAlert({
        type: 'error',
        title: 'Failed to fetch location',
        message: 'Please try again or enter manually',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox for job location
  const handleJobLocationCheckbox = (checked: boolean) => {
    setSameAsCurrentJob(checked);
    if (checked && location) {
      const formattedLocation = `${location.city}, ${location.state}, ${location.country}`;
      setJobLocation(formattedLocation);
    }
  };

  // Handle checkbox for permanent location
  const handlePermanentLocationCheckbox = (checked: boolean) => {
    setSameAsCurrentPermanent(checked);
    if (checked && location) {
      const formattedLocation = `${location.city}, ${location.state}, ${location.country}`;
      setPermanentLocation(formattedLocation);
    }
  };

  const openSettings = async () => {
    setShowPermissionModal(false);

    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                }}
                placeholder="Tell others about yourself, your interests, and what you're looking for..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.label}>Current Location</Text>

              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleLocationPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.primary} size="small" />
                ) : (
                  <MapPin color={Colors.primary} size={20} />
                )}
                <View style={styles.locationTextContainer}>
                  {location ? (
                    <>
                      <Text style={styles.locationText}>
                        {location.city}, {location.state}
                      </Text>
                      <Text style={styles.locationSubText}>
                        {location.country}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.locationPlaceholder}>
                      {isLoading
                        ? 'Fetching location...'
                        : 'Tap to get your current location'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {location && (
                <View style={styles.coordinatesContainer}>
                  <Text style={styles.coordinatesText}>
                    📍 {location.coordinates.latitude.toFixed(6)},{' '}
                    {location.coordinates.longitude.toFixed(6)}
                  </Text>
                </View>
              )}
            </View>

            {/* Show Job and Permanent Location only after current location is fetched */}
            {location && (
              <>
                {/* Job Location */}
                <View style={profileStyles.inputGroup}>
                  <Text style={profileStyles.label}>Job Location</Text>
                  <TextInput
                    style={[
                      profileStyles.input,
                      sameAsCurrentJob && styles.disabledInput,
                    ]}
                    value={jobLocation}
                    onChangeText={(value) => {
                      setJobLocation(value);
                    }}
                    placeholder="Enter your job location"
                    placeholderTextColor="#9CA3AF"
                    editable={!sameAsCurrentJob}
                  />
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleJobLocationCheckbox(!sameAsCurrentJob)}
                    disabled={!location}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        sameAsCurrentJob && styles.checkboxChecked,
                        !location && styles.checkboxDisabled,
                      ]}
                    >
                      {sameAsCurrentJob && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.checkboxLabel,
                        !location && styles.checkboxLabelDisabled,
                      ]}
                    >
                      Same as current location
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Permanent Location */}
                <View style={profileStyles.inputGroup}>
                  <Text style={profileStyles.label}>Permanent Location</Text>
                  <TextInput
                    style={[
                      profileStyles.input,
                      sameAsCurrentPermanent && styles.disabledInput,
                    ]}
                    value={permanentLocation}
                    onChangeText={(value) => {
                      setPermanentLocation(value);
                    }}
                    placeholder="Enter your permanent location"
                    placeholderTextColor="#9CA3AF"
                    editable={!sameAsCurrentPermanent}
                  />
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() =>
                      handlePermanentLocationCheckbox(!sameAsCurrentPermanent)
                    }
                    disabled={!location}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        sameAsCurrentPermanent && styles.checkboxChecked,
                        !location && styles.checkboxDisabled,
                      ]}
                    >
                      {sameAsCurrentPermanent && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.checkboxLabel,
                        !location && styles.checkboxLabelDisabled,
                      ]}
                    >
                      Same as current location
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <InputOutlineBox
              label="Education"
              value={education}
              onChangeText={(value) => {
                setEducation(value);
              }}
              placeholder="Your highest qualification"
            />

            <InputOutlineBox
              label="Occupation"
              value={occupation}
              onChangeText={(value) => {
                setOccupation(value);
              }}
              placeholder="What do you do for work?"
            />

            <InputOutlineBox
              label="Annual Income"
              value={salary}
              onChangeText={(value) => {
                setSalary(value);
              }}
              placeholder="What is your annual salary?"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <PrimaryButton
        title={'Save Info'}
        enabled={!btnLoading}
        isLoading={btnLoading}
        onPress={handleSaveButton}
      />

      <Modal
        visible={showPermissionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPermissionModal(false)}
            >
              <X color="#6B7280" size={24} />
            </TouchableOpacity>

            <View style={styles.modalIconContainer}>
              <AlertCircle color={Colors.primary} size={48} />
            </View>

            <Text style={styles.modalTitle}>Location Permission Required</Text>
            <Text style={styles.modalMessage}>
              To automatically fetch your location, please enable location
              permission in your device settings.
            </Text>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={openSettings}
            >
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPermissionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  locationSubText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  locationPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  coordinatesContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkboxLabelDisabled: {
    color: '#D1D5DB',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
});

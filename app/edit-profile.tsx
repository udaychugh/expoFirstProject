import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronUp,
  Camera,
  Plus,
  X,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import ProfileInput from './profile-details/component/ProfileInput';
import RenderSection from './profile-details/component/renderSection';
import BasicInfo from './profile-details/component/basicInfo';
import PhysicalAttr from './profile-details/component/physicalAttr';
import LifeStyle from './profile-details/component/lifestyle';
import InterestsAndHobbies from './profile-details/component/interestNHobbies';
import Favorites from './profile-details/component/favorites';
import FamilyAndPersonal from './profile-details/component/familyNPersonal';

export interface ProfileData {
  name: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  gender: string;
  phoneNumber: string;
  email: string;
  education: string;
  maritalStatus: string;
  height: string;
  weight: string;
  bloodGroup: string;
  languagesSpoken: string[];
  dressStyle: string;
  favoriteBooks: string;
  favoriteSongs: string;
  favoriteMovies: string;
  vacationDestination: string;
  bodyType: string;
  complexion: string;
  hasDisability: boolean;
  description: string;
  diet: string;
  drinkingHabit: string;
  smokingHabit: string;
  hobbies: string[];
  sportsAndFitness: string[];
  hasChildren: string;
  images: string[];
}

export const MultiSelectField = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
}: {
  label: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOption = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];
    onSelectionChange(newSelection);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.multiSelectHeader,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Text style={styles.multiSelectText}>
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : 'Select options'}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </Pressable>

      {isExpanded && (
        <View style={styles.multiSelectOptions}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.optionRow,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={() => toggleOption(option)}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedValues.includes(option) && styles.checkboxSelected,
                ]}
              >
                {selectedValues.includes(option) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export const SelectField = ({
  label,
  options,
  selectedValue,
  onSelectionChange,
}: {
  label: string;
  options: string[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selectHeader,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Text style={[styles.selectText, !selectedValue && styles.placeholder]}>
          {selectedValue || 'Select option'}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </Pressable>

      {isExpanded && (
        <View style={styles.selectOptions}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.selectOption,
                selectedValue === option && styles.selectedOption,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                onSelectionChange(option);
                setIsExpanded(false);
              }}
              android_ripple={{ color: 'rgba(225, 29, 72, 0.1)' }}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  selectedValue === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function EditProfile() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    city: '',
    state: '',
    country: '',
    occupation: '',
    gender: '',
    phoneNumber: '',
    email: '',
    education: '',
    maritalStatus: '',
    height: '',
    weight: '',
    bloodGroup: '',
    languagesSpoken: [],
    dressStyle: '',
    favoriteBooks: '',
    favoriteSongs: '',
    favoriteMovies: '',
    vacationDestination: '',
    bodyType: '',
    complexion: '',
    hasDisability: false,
    description: '',
    diet: '',
    drinkingHabit: '',
    smokingHabit: '',
    hobbies: [],
    sportsAndFitness: [],
    hasChildren: '',
    images: [],
  });

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = async () => {
    if (profileData.images.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload maximum 6 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...profileData.images, result.assets[0].uri];
      handleInputChange('images', newImages);
    }
  };

  const handleTakePhoto = async () => {
    if (profileData.images.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload maximum 6 images');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...profileData.images, result.assets[0].uri];
      handleInputChange('images', newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = profileData.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Update basic info
      await ApiService.updateBasicInfo({
        name: profileData.name,
        location: profileData.city,
        occupation: profileData.occupation,
        education: profileData.education,
        bio: profileData.description,
      });

      // Update personal details
      // TODO: Add age and gender here after
      await ApiService.updatePersonalDetails({
        height: profileData.height,
        weight: profileData.weight,
        maritalStatus: profileData.maritalStatus,
        bloodGroup: profileData.bloodGroup,
        bodyType: profileData.bodyType,
        complexion: profileData.complexion,
        hasDisability: profileData.hasDisability,
      });

      // Update lifestyle
      await ApiService.updateLifestyle({
        diet: profileData.diet,
        drinkingHabit: profileData.drinkingHabit,
        smokingHabit: profileData.smokingHabit,
        dressStyle: profileData.dressStyle,
      });

      // Update interests
      await ApiService.updateInterests({
        hobbies: profileData.hobbies,
        sportsAndFitness: profileData.sportsAndFitness,
        languagesSpoken: profileData.languagesSpoken,
      });

      // Update favorites
      await ApiService.updateFavorites({
        favoriteBooks: profileData.favoriteBooks,
        favoriteSongs: profileData.favoriteSongs,
        favoriteMovies: profileData.favoriteMovies,
        vacationDestination: profileData.vacationDestination,
      });

      // Update contact info
      await ApiService.updateContactInfo({
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          android_ripple={{
            color: 'rgba(0, 0, 0, 0.1)',
            borderless: true,
            radius: 24,
          }}
          style={({ pressed }) => [
            Platform.OS === 'ios' && pressed && { opacity: 0.6 },
          ]}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            saveLoading && styles.saveButtonDisabled,
            Platform.OS === 'ios' &&
              pressed &&
              !saveLoading && { opacity: 0.8 },
          ]}
          disabled={saveLoading}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          {saveLoading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <Save size={20} color="#FFFFFF" />
          )}
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <RenderSection title="Profile Photos" isExpanded={true}>
            <Text style={styles.sectionDescription}>
              Add up to 6 photos to showcase yourself. First photo will be your
              main profile picture.
            </Text>

            <View style={styles.imagesGrid}>
              {profile?.images?.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.profileImage}
                  />
                  <Pressable
                    style={({ pressed }) => [
                      styles.removeImageButton,
                      Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleRemoveImage(index)}
                    android_ripple={{
                      color: 'rgba(255, 255, 255, 0.3)',
                      borderless: true,
                      radius: 16,
                    }}
                  >
                    <X color="#FFFFFF" size={16} />
                  </Pressable>
                  {index === 0 && (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Main</Text>
                    </View>
                  )}
                </View>
              ))}

              {(profile?.images?.length || 0) < 6 && (
                <View style={styles.addImageContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.addImageButton,
                      Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                    ]}
                    onPress={handleImagePicker}
                    android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
                  >
                    <Plus color="#9CA3AF" size={24} />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.cameraButton,
                      Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                    ]}
                    onPress={handleTakePhoto}
                    android_ripple={{
                      color: 'rgba(225, 29, 72, 0.2)',
                      borderless: true,
                      radius: 20,
                    }}
                  >
                    <Camera color="#E11D48" size={20} />
                  </Pressable>
                </View>
              )}
            </View>
          </RenderSection>

          <BasicInfo profile={profile} handleInputChange={handleInputChange} />

          <PhysicalAttr
            profile={profile}
            handleInputChange={handleInputChange}
          />

          <LifeStyle profile={profile} handleInputChange={handleInputChange} />

          <InterestsAndHobbies
            profile={profile}
            handleInputChange={handleInputChange}
          />

          <Favorites profile={profile} handleInputChange={handleInputChange} />

          <FamilyAndPersonal
            profile={profile}
            handleInputChange={handleInputChange}
          />

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  multiSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  multiSelectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  multiSelectOptions: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  selectOptions: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#FEF2F2',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#E11D48',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 40,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#E11D48',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  addImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  addImageButton: {
    width: 100,
    height: 80,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  addImageText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E11D48',
  },
});

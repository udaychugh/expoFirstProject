import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
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

interface ProfileData {
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

const MultiSelectField = ({
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
      <TouchableOpacity
        style={styles.multiSelectHeader}
        onPress={() => setIsExpanded(!isExpanded)}
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
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.multiSelectOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => toggleOption(option)}
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
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const SelectField = ({
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
      <TouchableOpacity
        style={styles.selectHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.selectText, !selectedValue && styles.placeholder]}>
          {selectedValue || 'Select option'}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.selectOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.selectOption,
                selectedValue === option && styles.selectedOption,
              ]}
              onPress={() => {
                onSelectionChange(option);
                setIsExpanded(false);
              }}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  selectedValue === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
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

  const languages = [
    'Bengali',
    'Hindi',
    'English',
    'Marathi',
    'Tamil',
    'Telugu',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'Odia',
    'Assamese',
  ];

  const hobbiesOptions = [
    'Movies',
    'Books',
    'Travel',
    'Biking',
    'Hiking',
    'Soccer',
    'Cricket',
    'Foods',
    'Blogging',
    'Dance',
    'Theater',
    'Photography',
    'Music',
  ];

  const sportsOptions = [
    'Badminton',
    'Swimming',
    'Reading',
    'Yoga',
    'Gym',
    'Running',
    'Cycling',
    'Tennis',
    'Basketball',
    'Football',
  ];

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
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, saveLoading && styles.saveButtonDisabled]}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <Save size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
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
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <X color="#FFFFFF" size={16} />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Main</Text>
                    </View>
                  )}
                </View>
              ))}

              {(profile?.images?.length || 0) < 6 && (
                <View style={styles.addImageContainer}>
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleImagePicker}
                  >
                    <Plus color="#9CA3AF" size={24} />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={handleTakePhoto}
                  >
                    <Camera color="#E11D48" size={20} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </RenderSection>

          <RenderSection title="Basic Information" isExpanded={true}>
            <>
              <ProfileInput
                label="Full Name"
                placeholder="Enter your full name"
                presetValue={profile?.fullName}
                onChange={(value) => handleInputChange('name', value)}
              />

              <ProfileInput
                label="City"
                placeholder="Enter your city"
                presetValue={profile?.location?.city}
                onChange={(value) => handleInputChange('city', value)}
              />

              <ProfileInput
                label="State"
                placeholder="Enter your state"
                presetValue={profile?.location?.state}
                onChange={(value) => handleInputChange('state', value)}
              />

              <ProfileInput
                label="Country"
                placeholder="Enter your country"
                presetValue={profile?.location?.country}
                onChange={(value) => handleInputChange('country', value)}
              />

              <ProfileInput
                label="Occupation"
                placeholder="Enter your occupation"
                presetValue={profile?.occupation}
                onChange={(value) => handleInputChange('occupation', value)}
              />

              <SelectField
                label="Gender"
                options={['Male', 'Female', 'Prefer Not To Say']}
                selectedValue={profileData.gender}
                onSelectionChange={(value) =>
                  handleInputChange('gender', value)
                }
              />

              <ProfileInput
                label="Phone Number"
                placeholder="Enter your phone number"
                presetValue={profile?.phone}
                onChange={(value) => handleInputChange('phoneNumber', value)}
                keyboard="phone-pad"
              />

              <ProfileInput
                label="Email"
                placeholder="Enter your email"
                presetValue={profile?.email}
                onChange={(value) => handleInputChange('email', value)}
                keyboard="email-address"
              />

              <ProfileInput
                label="Education"
                placeholder="Enter your education"
                presetValue={profile?.education}
                onChange={(value) => handleInputChange('education', value)}
              />

              <SelectField
                label="Marital Status"
                options={[
                  'Single',
                  'Widowed',
                  'Married',
                  'Divorced',
                  'Separated',
                ]}
                selectedValue={profileData.maritalStatus}
                onSelectionChange={(value) =>
                  handleInputChange('maritalStatus', value)
                }
              />

              <MultiSelectField
                label="Languages Spoken"
                options={languages}
                selectedValues={profileData.languagesSpoken}
                onSelectionChange={(values) =>
                  handleInputChange('languagesSpoken', values)
                }
              />
            </>
          </RenderSection>

          <RenderSection title="Physical Attributes" isExpanded={false}>
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  placeholder="e.g., 5'6"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  placeholder="e.g., 65 kg"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <SelectField
                label="Blood Group"
                options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                selectedValue={profileData.bloodGroup}
                onSelectionChange={(value) =>
                  handleInputChange('bloodGroup', value)
                }
              />

              <SelectField
                label="Body Type"
                options={['Slim', 'Athletic', 'Average', 'Chubby']}
                selectedValue={profileData.bodyType}
                onSelectionChange={(value) =>
                  handleInputChange('bodyType', value)
                }
              />

              <SelectField
                label="Complexion"
                options={['Very Fair', 'Fair', 'Wheatish', 'Dark']}
                selectedValue={profileData.complexion}
                onSelectionChange={(value) =>
                  handleInputChange('complexion', value)
                }
              />

              <View style={styles.fieldContainer}>
                <View style={styles.switchRow}>
                  <Text style={styles.label}>Any Disability</Text>
                  <Switch
                    value={profileData.hasDisability}
                    onValueChange={(value) =>
                      handleInputChange('hasDisability', value)
                    }
                    trackColor={{ false: '#E5E7EB', true: '#FDE2E7' }}
                    thumbColor={
                      profileData.hasDisability ? '#E11D48' : '#9CA3AF'
                    }
                  />
                </View>
              </View>
            </>
          </RenderSection>

          <RenderSection title="Lifestyle" isExpanded={false}>
            <>
              <SelectField
                label="Diet"
                options={[
                  'Vegetarian',
                  'Eggetarian',
                  'Both',
                  'Non-vegetarian',
                  'Jain',
                  'Vegan',
                ]}
                selectedValue={profileData.diet}
                onSelectionChange={(value) => handleInputChange('diet', value)}
              />

              <SelectField
                label="Drinking Habit"
                options={['No', 'Regular', 'Occasional']}
                selectedValue={profileData.drinkingHabit}
                onSelectionChange={(value) =>
                  handleInputChange('drinkingHabit', value)
                }
              />

              <SelectField
                label="Smoking Habit"
                options={['No', 'Regular', 'Occasional']}
                selectedValue={profileData.smokingHabit}
                onSelectionChange={(value) =>
                  handleInputChange('smokingHabit', value)
                }
              />

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Dress Style</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.dressStyle}
                  onChangeText={(value) =>
                    handleInputChange('dressStyle', value)
                  }
                  placeholder="Describe your dress style"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          </RenderSection>

          <RenderSection title="Interests & Hobbies" isExpanded={false}>
            <>
              <MultiSelectField
                label="Hobbies"
                options={hobbiesOptions}
                selectedValues={profileData.hobbies}
                onSelectionChange={(values) =>
                  handleInputChange('hobbies', values)
                }
              />

              <MultiSelectField
                label="Sports & Fitness"
                options={sportsOptions}
                selectedValues={profileData.sportsAndFitness}
                onSelectionChange={(values) =>
                  handleInputChange('sportsAndFitness', values)
                }
              />
            </>
          </RenderSection>

          <RenderSection title="Favorites" isExpanded={false}>
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Favorite Books</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.favoriteBooks}
                  onChangeText={(value) =>
                    handleInputChange('favoriteBooks', value)
                  }
                  placeholder="Enter favorite books"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Favorite Songs</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.favoriteSongs}
                  onChangeText={(value) =>
                    handleInputChange('favoriteSongs', value)
                  }
                  placeholder="Enter favorite songs"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Favorite Movies</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.favoriteMovies}
                  onChangeText={(value) =>
                    handleInputChange('favoriteMovies', value)
                  }
                  placeholder="Enter favorite movies"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Vacation Destination</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.vacationDestination}
                  onChangeText={(value) =>
                    handleInputChange('vacationDestination', value)
                  }
                  placeholder="Enter dream vacation destination"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          </RenderSection>

          <RenderSection title="Family & Personal" isExpanded={false}>
            <>
              <SelectField
                label="Do you have children?"
                options={['No', 'Yes', 'Prefer not to say']}
                selectedValue={profileData.hasChildren}
                onSelectionChange={(value) =>
                  handleInputChange('hasChildren', value)
                }
              />

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>About Me</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={profileData.description}
                  onChangeText={(value) =>
                    handleInputChange('description', value)
                  }
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </>
          </RenderSection>

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

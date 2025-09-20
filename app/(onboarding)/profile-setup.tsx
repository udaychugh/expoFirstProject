import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    gender: '',
    dateOfBirth: '',
    religion: '',
    caste: '',
    occupation: '',
    education: '',
    height: '',
    maritalStatus: '',
    location: '',
    bio: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile setup
      router.push('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={[styles.option, profileData.gender === 'Male' && styles.selectedOption]}
                    onPress={() => handleInputChange('gender', 'Male')}
                  >
                    <Text style={[styles.optionText, profileData.gender === 'Male' && styles.selectedOptionText]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.option, profileData.gender === 'Female' && styles.selectedOption]}
                    onPress={() => handleInputChange('gender', 'Female')}
                  >
                    <Text style={[styles.optionText, profileData.gender === 'Female' && styles.selectedOptionText]}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <View style={styles.inputWithIcon}>
                  <Calendar color="#9CA3AF" size={20} />
                  <TextInput
                    style={styles.inputText}
                    value={profileData.dateOfBirth}
                    onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Religion</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.religion}
                  onChangeText={(value) => handleInputChange('religion', value)}
                  placeholder="Enter your religion"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Caste/Community</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.caste}
                  onChangeText={(value) => handleInputChange('caste', value)}
                  placeholder="Enter your caste/community"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Professional & Personal</Text>
            <Text style={styles.stepSubtitle}>Help others know you better</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Occupation</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.occupation}
                  onChangeText={(value) => handleInputChange('occupation', value)}
                  placeholder="What do you do for work?"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Education</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.education}
                  onChangeText={(value) => handleInputChange('education', value)}
                  placeholder="Your highest qualification"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  placeholder={`e.g., 5'6"`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marital Status</Text>
                <View style={styles.optionsColumn}>
                  {['Never Married', 'Divorced', 'Widowed'].map((status) => (
                    <TouchableOpacity 
                      key={status}
                      style={[styles.option, profileData.maritalStatus === status && styles.selectedOption]}
                      onPress={() => handleInputChange('maritalStatus', status)}
                    >
                      <Text style={[styles.optionText, profileData.maritalStatus === status && styles.selectedOptionText]}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location & About</Text>
            <Text style={styles.stepSubtitle}>Final details to complete your profile</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.inputWithIcon}>
                  <MapPin color="#9CA3AF" size={20} />
                  <TextInput
                    style={styles.inputText}
                    value={profileData.location}
                    onChangeText={(value) => handleInputChange('location', value)}
                    placeholder="City, State"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>About Me</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={profileData.bio}
                  onChangeText={(value) => handleInputChange('bio', value)}
                  placeholder="Tell others about yourself, your interests, and what you're looking for..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile Setup</Text>
        <Text style={styles.stepIndicator}>{currentStep}/3</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={handleBack}>
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Complete Profile' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  stepIndicator: {
    fontSize: 16,
    color: '#E11D48',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 24,
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContent: {
    paddingTop: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionsColumn: {
    gap: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E11D48',
    height: 58,
    flex: 1,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  prevButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E11D48',
    height: 58,
    flex: 1,
    marginEnd: 10
  },
  prevButtonText: {
    color: '#E11D48',
    fontSize: 18,
    fontWeight: '600',
  },
});
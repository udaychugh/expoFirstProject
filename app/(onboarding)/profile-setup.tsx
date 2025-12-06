import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BasicInfoSetup from './components/basic-info-setup';
import ProfessionalPersonaInfo from './components/prof-pres-info';
import LocationAboutInfo from './components/location-info';
import { profileStyles } from './components/styles';

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
    setProfileData((prev) => ({ ...prev, [field]: value }));
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
        return <BasicInfoSetup handleInputChange={handleInputChange} />;

      case 2:
        return (
          <ProfessionalPersonaInfo handleInputChange={handleInputChange} />
        );

      case 3:
        return <LocationAboutInfo handleInputChange={handleInputChange} />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <View style={profileStyles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={profileStyles.title}>Profile Setup</Text>
        <Text style={profileStyles.stepIndicator}>{currentStep}/3</Text>
      </View>

      <View style={profileStyles.progressBar}>
        <View
          style={[
            profileStyles.progress,
            { width: `${(currentStep / 3) * 100}%` },
          ]}
        />
      </View>

      <View style={profileStyles.content}>{renderStepContent()}</View>

      <View style={profileStyles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={profileStyles.prevButton}
            onPress={handleBack}
          >
            <Text style={profileStyles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={profileStyles.nextButton} onPress={handleNext}>
          <Text style={profileStyles.nextButtonText}>
            {currentStep === 3 ? 'Complete Profile' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

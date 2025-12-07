import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BasicInfoSetup from './components/basic-info-setup';
import ProfessionalPersonaInfo from './components/prof-pres-info';
import LifeStyle from './components/lifestyle';
import { profileStyles } from './components/styles';
import InterestSkills from './components/interestSkills';
import Favourites from './components/favourites';
import AddImages from './components/add-images';
import { Colors } from '@/assets/colors/colors';
import FamilyDetail from './components/family-details';

export default function ProfileSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);

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
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile setup
      router.push('/(tabs)');
    }
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const handleCompleteNow = () => {
    setShowSkipModal(false);
  };

  const handleDoLater = () => {
    setShowSkipModal(false);
    router.push('/(tabs)');
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      setShowSkipModal(true);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoSetup handleNext={handleNext} />;

      case 2:
        return <ProfessionalPersonaInfo handleNext={handleNext} />;

      case 3:
        return <FamilyDetail handleNext={handleNext} />;

      case 4:
        return <LifeStyle handleNext={handleNext} />;

      case 5:
        return <InterestSkills handleNext={handleNext} />;

      case 6:
        return <Favourites handleNext={handleNext} />;

      case 7:
        return <AddImages handleNext={handleNext} />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <View style={profileStyles.header}>
        {__DEV__ ? (
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.devNextText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={profileStyles.title}>Profile Setup</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={profileStyles.progressBar}>
        <View
          style={[
            profileStyles.progress,
            { width: `${(currentStep / 7) * 100}%` },
          ]}
        />
      </View>

      <View style={profileStyles.content}>{renderStepContent()}</View>

      {/* Skip Confirmation Modal */}
      <Modal
        visible={showSkipModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSkipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <AlertCircle color={Colors.primary} size={56} />
            </View>

            <Text style={styles.modalTitle}>Complete Your Profile</Text>
            <Text style={styles.modalMessage}>
              Completing your profile is required to make it public and get
              better matches. Are you sure you want to skip?
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCompleteNow}
            >
              <Text style={styles.primaryButtonText}>Complete Profile Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDoLater}
            >
              <Text style={styles.secondaryButtonText}>I'll Do It Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  devNextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981', // Green color for dev mode
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
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
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
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

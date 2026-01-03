import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  const MAX_STEP = 7;
  const MID_STEP = 4;
  const START_STEP = 1;

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(START_STEP);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const handleNext = () => {
    if (currentStep < MAX_STEP) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/');
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
    router.replace('/');
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      setShowSkipModal(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case START_STEP:
        return <BasicInfoSetup handleNext={handleNext} />;

      case START_STEP + 1:
        return <ProfessionalPersonaInfo handleNext={handleNext} />;

      case START_STEP + 2:
        return <FamilyDetail handleNext={handleNext} />;

      case MID_STEP:
        return <LifeStyle handleNext={handleNext} />;

      case MAX_STEP - 2:
        return <InterestSkills handleNext={handleNext} />;

      case MAX_STEP - 1:
        return <Favourites handleNext={handleNext} />;

      case MAX_STEP:
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
            { width: `${(currentStep / MAX_STEP) * 100}%` },
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

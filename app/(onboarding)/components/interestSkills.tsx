import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import { AlertCircle } from 'lucide-react-native';
import { HOBBIES, SPORTS_FITNESS, LANGUAGES } from '../models/interests';
import SelectList from './selectList';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function InterestSkills({
  handleNext,
}: {
  handleNext: () => void;
}) {
  // Interests states
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [sportsAndFitness, setSportsAndFitness] = useState<string[]>([]);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  // Check if any selection is made
  const hasSelections =
    hobbies.length > 0 ||
    sportsAndFitness.length > 0 ||
    languagesSpoken.length > 0;

  const handleSaveButton = async () => {
    if (!hasSelections) {
      // Show skip confirmation modal
      setShowSkipModal(true);
    } else {
      setLoading(true);

      try {
        const response = await ApiService.updateInterests({
          hobbies: hobbies,
          sportsAndFitness: sportsAndFitness,
          languagesSpoken: languagesSpoken,
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
        setLoading(false);
      }
    }
  };

  const handleSkipConfirm = () => {
    setShowSkipModal(false);
    console.log('Skipped interests section');
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <View style={styles.titleContainer}>
            <Text style={profileStyles.stepTitle}>Interests & Skills </Text>
            <Text style={styles.optionalText}>(Optional)</Text>
          </View>
          <Text style={profileStyles.stepSubtitle}>
            Share your hobbies and interests to find better matches
          </Text>

          <View style={profileStyles.form}>
            <SelectList
              title="Hobbies & Interests"
              listData={HOBBIES}
              setItemData={setHobbies}
            />

            <SelectList
              title="Sports & Fitness"
              listData={SPORTS_FITNESS}
              setItemData={setSportsAndFitness}
            />

            <SelectList
              title="Languages Spoken"
              listData={LANGUAGES}
              setItemData={setLanguagesSpoken}
            />
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={
          isLoading ? 'Saving...' : hasSelections ? 'Save & Continue' : 'Skip'
        }
        enabled={!isLoading}
        onPress={handleSaveButton}
      />

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
              <AlertCircle color={Colors.primary} size={48} />
            </View>

            <Text style={styles.modalTitle}>Skip Interests?</Text>
            <Text style={styles.modalMessage}>
              Adding your interests and hobbies can help you find better matches
              and boost your match score with potential partners.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowSkipModal(false)}
            >
              <Text style={styles.continueButtonText}>Add Interests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipConfirm}
            >
              <Text style={styles.skipButtonText}>Skip Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  horizontalList: {
    paddingVertical: 8,
    gap: 12,
  },
  imageCard: {
    width: 120,
    marginRight: 12,
  },
  selectedImageCard: {
    transform: [{ scale: 0.95 }],
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(225, 29, 72, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedCardText: {
    color: Colors.primary,
    fontWeight: '600',
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
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 14,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

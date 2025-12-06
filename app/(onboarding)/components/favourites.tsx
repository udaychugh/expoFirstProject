import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import { Image } from 'expo-image';
import { Check, AlertCircle } from 'lucide-react-native';
import { BOOKS, SONGS, MOVIES, VACATION_DESTINATIONS } from '../models/fav';

export default function Favourites({ handleNext }: { handleNext: () => void }) {
  // Favourites states
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
  const [vacationDestination, setVacationDestination] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  // Check if any selection is made
  const hasSelections =
    favoriteBooks.length > 0 ||
    favoriteSongs.length > 0 ||
    favoriteMovies.length > 0 ||
    vacationDestination.length > 0;

  // Toggle selection for arrays
  const toggleSelection = (
    item: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter((i) => i !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  const handleSaveButton = () => {
    if (!hasSelections) {
      // Show skip confirmation modal
      setShowSkipModal(true);
    } else {
      // Save and continue
      console.log({
        favoriteBooks,
        favoriteSongs,
        favoriteMovies,
        vacationDestination,
      });
      handleNext();
    }
  };

  const handleSkipConfirm = () => {
    setShowSkipModal(false);
    console.log('Skipped favourites section');
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <View style={styles.titleContainer}>
            <Text style={profileStyles.stepTitle}>Your Favourites </Text>
            <Text style={styles.optionalText}>(Optional)</Text>
          </View>
          <Text style={profileStyles.stepSubtitle}>
            Share what you love to find better matches
          </Text>

          <View style={profileStyles.form}>
            {/* Favourites Section */}
            <View style={styles.section}>
              {/* Favorite Books */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Books </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={BOOKS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteBooks.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteBooks,
                            setFavoriteBooks
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Favorite Songs */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Music </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={SONGS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteSongs.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteSongs,
                            setFavoriteSongs
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Favorite Movies */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Movies </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={MOVIES}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteMovies.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteMovies,
                            setFavoriteMovies
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Vacation Destinations */}
              <View style={[profileStyles.inputGroup, { marginBottom: 20 }]}>
                <Text style={profileStyles.label}>Dream Vacation </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={VACATION_DESTINATIONS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = vacationDestination.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            vacationDestination,
                            setVacationDestination
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={
          isLoading ? 'Saving...' : hasSelections ? 'Complete Profile' : 'Skip'
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

            <Text style={styles.modalTitle}>Skip Favourites?</Text>
            <Text style={styles.modalMessage}>
              Sharing your favourite books, music, and movies can help you find
              partners with similar tastes and boost your match score.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowSkipModal(false)}
            >
              <Text style={styles.continueButtonText}>Add Favourites</Text>
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

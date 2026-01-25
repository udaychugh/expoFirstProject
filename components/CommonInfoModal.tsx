import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { Heart, X } from 'lucide-react-native';
import AppImage from '@/components/AppImage';
import { Colors } from '@/assets/colors/colors';
import { UserProfile } from '@/contexts/model/userProfile';

interface CommonInfoModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  viewedUser: UserProfile | null;
}

interface CommonItem {
  id: string;
  label: string;
  value: string;
}

const { width, height } = Dimensions.get('window');

export default function CommonInfoModal({
  visible,
  onClose,
  currentUser,
  viewedUser,
}: CommonInfoModalProps) {
  const [loading, setLoading] = useState(true);
  const [commonData, setCommonData] = useState<CommonItem[]>([]);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      // Use setTimeout to allow the modal to open smoothly before starting calculation
      const timer = setTimeout(() => {
        calculateCommonalities();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCommonData([]);
    }
  }, [visible, currentUser, viewedUser]);

  const calculateCommonalities = () => {
    if (!currentUser || !viewedUser) {
      setLoading(false);
      return;
    }

    const common: CommonItem[] = [];
    let idCounter = 0;
    const add = (label: string, value: string) => {
      common.push({ id: `common-${idCounter++}`, label, value });
    };

    // 1. Basic Details
    if (currentUser.religion && currentUser.religion === viewedUser.religion) {
      add('Religion', currentUser.religion);
    }
    if (currentUser.caste && currentUser.caste === viewedUser.caste) {
      add('Caste', currentUser.caste);
    }
    if (currentUser.diet && currentUser.diet === viewedUser.diet) {
      add('Diet', currentUser.diet);
    }
    if (
      currentUser.smokingHabit &&
      currentUser.smokingHabit === viewedUser.smokingHabit
    ) {
      add('Smoking Habit', currentUser.smokingHabit);
    }
    if (
      currentUser.drinkingHabit &&
      currentUser.drinkingHabit === viewedUser.drinkingHabit
    ) {
      add('Drinking Habit', currentUser.drinkingHabit);
    }
    if (
      currentUser.maritalStatus &&
      currentUser.maritalStatus === viewedUser.maritalStatus
    ) {
      add('Marital Status', currentUser.maritalStatus);
    }
    if (currentUser.manglik === viewedUser.manglik) {
      add('Manglik', currentUser.manglik ? 'Yes' : 'No');
    }

    // 2. Education & Career
    if (
      currentUser.education &&
      currentUser.education === viewedUser.education
    ) {
      add('Education', currentUser.education);
    }
    if (
      currentUser.occupation &&
      currentUser.occupation === viewedUser.occupation
    ) {
      add('Occupation', currentUser.occupation);
    }

    // 3. Location (City/State)
    if (
      currentUser.location?.city &&
      currentUser.location.city === viewedUser.location?.city
    ) {
      add('City', currentUser.location.city);
    } else if (
      currentUser.location?.state &&
      currentUser.location.state === viewedUser.location?.state
    ) {
      add('State', currentUser.location.state);
    }

    // 4. Arrays (Intersections)
    const compareArrays = (label: string, arr1?: string[], arr2?: string[]) => {
      if (!arr1 || !arr2) return;
      const intersection = arr1.filter((item) => arr2.includes(item));
      if (intersection.length > 0) {
        add(label, intersection.join(', '));
      }
    };

    compareArrays(
      'Languages',
      currentUser.languagesSpoken,
      viewedUser.languagesSpoken,
    );
    compareArrays('Hobbies', currentUser.hobbies, viewedUser.hobbies);
    compareArrays(
      'Sports & Fitness',
      currentUser.sportsAndFitness,
      viewedUser.sportsAndFitness,
    );
    compareArrays(
      'Favorite Books',
      currentUser.favoriteBooks,
      viewedUser.favoriteBooks,
    );
    compareArrays(
      'Favorite Movies',
      currentUser.favoriteMovies,
      viewedUser.favoriteMovies,
    );
    compareArrays(
      'Favorite Songs',
      currentUser.favoriteSongs,
      viewedUser.favoriteSongs,
    );
    compareArrays(
      'Travel Destinations',
      currentUser.vacationDestination,
      viewedUser.vacationDestination,
    );

    setCommonData(common);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: CommonItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLabel}>{item.label}</Text>
      <Text style={styles.itemValue}>{item.value}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          {/* Header Handle */}
          <View style={styles.handle} />

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </Pressable>

          <Text style={styles.title}>You Both Have in Common</Text>

          {/* Header: User Images */}
          <View style={styles.headerRow}>
            <View style={styles.userColumn}>
              <View style={styles.imageContainer}>
                <AppImage
                  src={currentUser?.mainImage || ''}
                  style={styles.image}
                />
              </View>
              <Text style={styles.userName} numberOfLines={1}>
                You
              </Text>
            </View>

            <View style={styles.heartContainer}>
              <Heart
                size={24}
                color={Colors.primary || '#E11D48'}
                fill={Colors.primary || '#E11D48'}
              />
              <View style={styles.connectorLine} />
            </View>

            <View style={styles.userColumn}>
              <View style={styles.imageContainer}>
                <AppImage
                  src={viewedUser?.mainImage || ''}
                  style={styles.image}
                />
              </View>
              <Text style={styles.userName} numberOfLines={1}>
                {viewedUser?.fullName?.split(' ')[0] || 'User'}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={Colors.primary || '#E11D48'}
                />
                <Text style={styles.loadingText}>Finding common things...</Text>
              </View>
            ) : commonData.length > 0 ? (
              <FlatList
                data={commonData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nothing in common yet!</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.7,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  userColumn: {
    alignItems: 'center',
    width: 80,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary || '#E11D48',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  heartContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    position: 'absolute',
    width: 80,
    height: 1,
    backgroundColor: '#FECDD3', // Light pink
    zIndex: -1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLabel: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});

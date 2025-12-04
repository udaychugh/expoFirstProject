import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Info,
  Filter,
  Star,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ApiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import FilterBottomSheet, {
  FilterOptions,
} from '@/components/FilterBottomSheet';
import AppImage from '@/components/AppImage';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.6;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const pan = useRef(new Animated.ValueXY()).current;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async (filters?: FilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDiscoveryProfiles({
        limit: 10,
        ...filters,
      });
      if (response.success && response.data) {
        console.log('Profiles loaded:', response.data);
        setProfiles(response.data);
        setCurrentIndex(0); // Reset to first profile when loading new results
      } else {
        if (response.error?.startsWith('401')) {
          router.replace('/welcome');
        } else {
          setError(response.error || 'Failed to load profiles');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;

      if (Math.abs(dx) > 100) {
        // Swipe threshold reached
        const direction = dx > 0 ? 'right' : 'left';

        Animated.timing(pan, {
          toValue: { x: direction === 'right' ? width : -width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          handleSwipe(direction);
        });
      } else {
        // Return to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Call API for swipe action
    try {
      // const action = direction === 'right' ? 'like' : 'pass';
      // const response = await ApiService.swipeProfile({
      //   profileId: currentProfile.id,
      //   action,
      // });
      // if (response.success && response.data?.isMatch && direction === 'right') {
      //   // Show match notification or navigate to match screen
      //   console.log('It\'s a match!', response.data);
      //   // You can show a match modal here
      // }
    } catch (error) {
      console.error('Swipe error:', error);
    }

    if (direction === 'right') {
      console.log('Liked profile');
    } else {
      console.log('Passed profile');
    }

    // Move to next profile
    const nextIndex = currentIndex + 1;
    if (nextIndex >= profiles.length) {
      // Load more profiles or show end message
      //loadProfiles();
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
    pan.setValue({ x: 0, y: 0 });
  };

  const handleLike = () => {
    Animated.timing(pan, {
      toValue: { x: width, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe('right');
    });
  };

  const handlePass = () => {
    Animated.timing(pan, {
      toValue: { x: -width, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe('left');
    });
  };

  const handleShortlist = () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // TODO: Call API to add profile to shortlist
    console.log('Shortlisted profile:', currentProfile.id);

    // Move to next profile without animation
    const nextIndex = currentIndex + 1;
    if (nextIndex >= profiles.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
    pan.setValue({ x: 0, y: 0 });
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    loadProfiles(filters);
  };

  if (loading && profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profiles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more profiles to show</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
            <Text style={styles.retryButtonText}>Load More</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>
              Find your perfect life partner
            </Text>
          </View>
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter color="#E11D48" size={24} />
            {Object.keys(appliedFilters).length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {Object.keys(appliedFilters).length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                {
                  rotate: pan.x.interpolate({
                    inputRange: [-width / 2, 0, width / 2],
                    outputRange: ['-15deg', '0deg', '15deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <AppImage
            src={profiles[currentIndex].images?.[0]}
            style={styles.profileImage}
            disableFullScreen={true}
          />

          <View style={styles.overlay}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {profiles[currentIndex].fullName}, {profiles[currentIndex].age}
              </Text>

              <View style={styles.infoRow}>
                <MapPin color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>
                  {JSON.stringify(profiles[currentIndex].location)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Briefcase color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>
                  {JSON.stringify(profiles[currentIndex].occupation)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <GraduationCap color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>
                  {profiles[currentIndex].education}
                </Text>
              </View>

              <Text style={styles.bio} numberOfLines={2}>
                {profiles[currentIndex].bio}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.infoButton}
              onPress={() =>
                router.push(`/profile-details/${profiles[currentIndex].id}`)
              }
            >
              <Info color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.passButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePass}
        >
          {({ pressed }) => (
            <>
              <X color="#EF4444" size={24} />
              <Text style={styles.actionLabel}>Not Interested</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.shortlistButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleShortlist}
        >
          {({ pressed }) => (
            <>
              <Star
                color="#F59E0B"
                size={28}
                fill={pressed ? '#F59E0B' : 'none'}
              />
              <Text style={styles.actionLabelShortlist}>Shortlist</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.likeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLike}
        >
          {({ pressed }) => (
            <>
              <Heart
                color="#E11D48"
                size={24}
                fill={pressed ? '#E11D48' : 'none'}
              />
              <Text style={styles.actionLabel}>Interested</Text>
            </>
          )}
        </Pressable>
      </View>

      <FilterBottomSheet
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E11D48',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    width: width - 40,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
    lineHeight: 20,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  passButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  shortlistButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  likeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  actionLabelShortlist: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 4,
  },
});

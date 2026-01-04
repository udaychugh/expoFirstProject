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
  MapPin,
  Briefcase,
  GraduationCap,
  Info,
  Filter,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ApiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import FilterBottomSheet, {
  FilterOptions,
} from '@/components/FilterBottomSheet';
import AppImage from '@/components/AppImage';
import { calculateAge } from '@/utils/helper';
import SwipeHandler from '@/components/SwipeHandler';
import RequestToProcess from '@/components/process/requestToCompleteProfile';
import { ShowAlert } from '@/components/Alert';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.65;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const pan = useRef(new Animated.ValueXY()).current;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});

  // Load profiles on component mount
  useEffect(() => {
    if (profile?.profileComplete && profile?.isVerified) {
      loadProfiles();
    }
  }, [profile]);

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

  // Flag to control swipe animation
  const SWIPE_ANIMATION_ENABLED = false;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false, // Don't capture on initial touch
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only capture if there's actual movement (swipe gesture) AND animation is enabled
      return (
        SWIPE_ANIMATION_ENABLED &&
        (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5)
      );
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;

      if (Math.abs(dx) > 100) {
        // Swipe threshold reached
        const direction = dx > 0 ? 'right' : 'left';

        if (SWIPE_ANIMATION_ENABLED) {
          Animated.timing(pan, {
            toValue: { x: direction === 'right' ? width : -width, y: 0 },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            handleSwipe(direction);
          });
        } else {
          handleSwipe(direction);
        }
      } else {
        // Return to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const onSuccessAction = () => {
    const currentId = profiles[currentIndex]?.id;
    if (!currentId) return;

    // Remove from local state
    const newProfiles = profiles.filter((p) => p.id !== currentId);
    setProfiles(newProfiles);

    // Reset pan position
    pan.setValue({ x: 0, y: 0 });

    // Check if we need to load more or adjust index
    if (newProfiles.length === 0) {
      loadProfiles();
      setCurrentIndex(0);
    } else if (currentIndex >= newProfiles.length) {
      setCurrentIndex(0);
    }
    // If currentIndex is valid for new array, it points to the Next item automatically
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Call API for swipe action
    try {
      setActionLoading(true);
      const action = direction === 'right' ? 'like' : 'pass';
      const response = await ApiService.swipeProfile({
        profileId: currentProfile.id,
        action,
      });

      if (response.success) {
        if (response.data?.isMatch && direction === 'right') {
          console.log("It's a match!", response.data);
        }
        // Remove profile on success
        onSuccessAction();
      }
    } catch (error) {
      console.error('Swipe error:', error);
    } finally {
      setActionLoading(false);
    }

    if (direction === 'right') {
      console.log('Liked profile');
    } else {
      console.log('Passed profile');
    }
  };

  const handleLike = () => {
    const likeAction = async () => {
      try {
        setActionLoading(true);
        const currentProfile = profiles[currentIndex];
        if (!currentProfile) return;
        const response = await ApiService.sendConnectionRequest(
          currentProfile.id
        );
        if (response.success) {
          console.log('Connection request sent successfully');
          ShowAlert({
            type: 'success',
            title: 'Success',
            message: 'Connection request sent successfully',
          });
          onSuccessAction();
        } else {
          ShowAlert({
            type: 'error',
            title: 'Error',
            message: 'Connection request failed',
          });
        }
      } catch (error) {
        console.error('Connection request error:', error);
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: 'Connection request failed',
        });
      } finally {
        setActionLoading(false);
      }
    };

    if (SWIPE_ANIMATION_ENABLED) {
      Animated.timing(pan, {
        toValue: { x: width, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }).start(likeAction);
    } else {
      likeAction();
    }
  };

  const handlePass = () => {
    if (SWIPE_ANIMATION_ENABLED) {
      Animated.timing(pan, {
        toValue: { x: -width, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        handleSwipe('left');
      });
    } else {
      handleSwipe('left');
    }
  };

  const handleShortlist = async () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    console.log('Shortlisted profile:', currentProfile.id);

    try {
      setActionLoading(true);
      const response = await ApiService.shortListUser(currentProfile.id);
      if (response.success) {
        console.log('Profile shortlisted successfully');
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Profile shortlisted successfully',
        });
        onSuccessAction();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: 'Profile shortlisted failed',
        });
      }
    } catch (error) {
      console.error('Error shortlisting profile:', error);
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Profile shortlisted failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    loadProfiles(filters);
  };

  if (profile && !profile.profileComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <RequestToProcess
          title="Incomplete Profile"
          description="Please complete your profile to start discovering profiles."
          buttonTitle="Complete Profile"
          route="/edit-profile"
        />
      </SafeAreaView>
    );
  }

  if (profile && !profile.isVerified) {
    const description =
      profile.verificationStatus == 'pending'
        ? 'Please wait for admin to approve your account.'
        : profile.verificationStatus == 'rejected'
        ? 'Go to more details to check what can be done now to fix the issue.'
        : 'Please verify yourself to view profiles.';

    const buttonText =
      profile.verificationStatus == 'pending'
        ? 'See Status'
        : profile.verificationStatus == 'rejected'
        ? 'More Details'
        : 'Verify Profile';
    return (
      <SafeAreaView style={styles.container}>
        <RequestToProcess
          title="Verification Required"
          description={description}
          buttonTitle={buttonText}
          route="/verification/verification"
        />
      </SafeAreaView>
    );
  }

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
      {/* Header */}
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

      {/* Card Container */}
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
            src={profiles[currentIndex].mainImage}
            style={styles.profileImage}
            disableFullScreen={true}
          />

          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.profileInfo} pointerEvents="none">
              <Text style={styles.name}>
                {profiles[currentIndex].fullName},{' '}
                {calculateAge(profiles[currentIndex].dateOfBirth)}
              </Text>

              <View style={styles.infoRow}>
                <MapPin color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>
                  {profiles[currentIndex].location.city},{' '}
                  {profiles[currentIndex].location.state}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Briefcase color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>
                  {profiles[currentIndex].occupation}
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

            <Pressable
              style={({ pressed }) => [
                styles.infoButton,
                pressed && styles.infoPressedEffect,
              ]}
              onPress={() => {
                console.log(
                  'Info button clicked! Profile ID:',
                  profiles[currentIndex]._id
                );
                router.push(
                  `/profile-details/${profiles[currentIndex].id}?hideButton=false&isShortlisted=false`
                );
              }}
            >
              <Info color="#FFFFFF" size={20} />
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {actionLoading ? (
        <View style={styles.loadingContainer2}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <SwipeHandler
          handlePass={handlePass}
          handleShortlist={handleShortlist}
          handleLike={handleLike}
          isShortlisted={false}
        />
      )}

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
  loadingContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100
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
    marginTop: 10,
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
      height: 4,
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
    elevation: 5,
    zIndex: 10,
  },
  infoPressedEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
});

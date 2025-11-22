import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, X, MapPin, Briefcase, GraduationCap, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ApiService from '@/services/api';
import { DUMMY_PROFILES } from '@/assets/profile';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.7;


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  // TODO: TO be removed once get working with API
  const userGender: 'male' | 'female' = 'male';
  const filteredProfiles = DUMMY_PROFILES.filter(
    p => p.gender !== userGender
  );


  const [profiles, setProfiles] = useState<any[]>(filteredProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load profiles on component mount
  // React.useEffect(() => {
  //   loadProfiles();
  // }, []);

  // const loadProfiles = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await ApiService.getDiscoveryProfiles({ limit: 10 });
  //     if (response.success && response.data) {
  //       setProfiles(response.data);
  //     } else {
  //       if (response.error?.startsWith('401')) {
  //         router.replace('/welcome');
  //       } else {
  //       setError(response.error || 'Failed to load profiles');
  //       }
  //     }
  //   } catch (err) {
  //     setError('Network error. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const currentProfile = profiles[currentIndex];

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

  if (!currentProfile) {
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
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your perfect match</Text>
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
          <Image 
            source={{ uri: currentProfile.images?.[0] || 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
            style={styles.profileImage} 
          />
          
          <View style={styles.overlay}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              
              <View style={styles.infoRow}>
                <MapPin color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>{currentProfile.location}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Briefcase color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>{currentProfile.occupation}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <GraduationCap color="#FFFFFF" size={16} />
                <Text style={styles.infoText}>{currentProfile.education}</Text>
              </View>
              
              <Text style={styles.bio} numberOfLines={2}>
                {currentProfile.bio}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => router.push(`/profile-details/${currentProfile.id}`)}
            >
              <Info color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <X color="#EF4444" size={28} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Heart color="#E11D48" size={28} />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 40,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
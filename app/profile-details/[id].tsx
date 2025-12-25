import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Moon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import { UserProfile } from '@/contexts/model/userProfile';
import AppImage from '@/components/AppImage';
import SwipeHandler from '@/components/SwipeHandler';
import { calculateAge } from '@/utils/helper';
import InterestsSection from '@/components/InterestsSection';
import { INTERESTS_DATA } from '@/utils/interestsData';

const { width } = Dimensions.get('window');

export default function ProfileDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDiscoveredProfileDetails(
        id as string
      );
      if (response.success && response.data) {
        setProfile(response.data);
        // Track profile view
        await ApiService.viewProfile(id as string);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await ApiService.likeProfile(id as string);
      if (response.success) {
        if (response.data?.isMatch) {
          // Show match notification
          ShowAlert({
            type: 'success',
            title: "It's a Match!",
            message: 'You both liked each other!',
          });
        }
        router.back();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to like profile',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    }
  };

  const handlePass = async () => {
    try {
      const response = await ApiService.passProfile(id as string);
      if (response.success) {
        router.back();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to pass profile',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    }
  };

  const handleShortlist = () => {
    console.log('Connect with profile:', id);
    router.push(`/chat/${id}`);
  };

  const HeaderSection = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile Details</Text>
        <View style={{ width: 24 }} />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderSection />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderSection />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Profile not found'}</Text>
          <Pressable style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  const renderImageIndicators = () => (
    <View style={styles.imageIndicators}>
      {profile.images?.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === currentImageIndex && styles.activeIndicator,
          ]}
        />
      ))}
    </View>
  );

  const renderPersonalDetails = ({
    title,
    value,
  }: {
    title: string;
    value: string;
  }) => {
    return value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{title}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Images */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentImageIndex(index);
            }}
          >
            {profile.images?.map((image: any, index: number) => (
              <AppImage src={image.url} style={styles.profileImage} />
            ))}
          </ScrollView>
          {renderImageIndicators()}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {profile.fullName}, {calculateAge(profile.dateOfBirth)}
            </Text>
            <Pressable
              onPress={() => {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2500);
              }}
              style={styles.verificationBadge}
            >
              {profile.isVerified ? (
                <CheckCircle2 size={20} fill="#3B82F6" />
              ) : (
                <AlertCircle size={20} fill="#F59E0B" />
              )}
              {showTooltip && (
                <View
                  style={[
                    styles.tooltipContainer,
                    !profile.isVerified && { backgroundColor: '#F59E0B' },
                  ]}
                >
                  <View
                    style={[
                      styles.tooltipArrow,
                      !profile.isVerified && { borderTopColor: '#F59E0B' },
                    ]}
                  />
                  <Text style={styles.tooltipText}>
                    {profile.isVerified
                      ? 'User verified'
                      : 'User verification pending'}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <MapPin color="#6B7280" size={16} />
              <Text style={styles.infoText}>
                {profile.location.city}, {profile.location.state}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Briefcase color="#6B7280" size={16} />
              <Text style={styles.infoText}>{profile.occupation}</Text>
            </View>

            <View style={styles.infoRow}>
              <GraduationCap color="#6B7280" size={16} />
              <Text style={styles.infoText}>{profile.education}</Text>
            </View>

            <View style={styles.infoRow}>
              <Users color="#6B7280" size={16} />
              <Text style={styles.infoText}>{profile.maritalStatus}</Text>
            </View>

            <View style={styles.infoRow}>
              <Moon color="#6B7280" size={16} />
              <Text style={styles.infoText}>
                {profile.manglik ? 'Manglik' : 'Not Manglik'}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.detailsGrid}>
            {renderPersonalDetails({
              title: 'Religion',
              value: profile.religion,
            })}

            {renderPersonalDetails({
              title: 'Caste',
              value: profile.caste,
            })}

            {renderPersonalDetails({
              title: 'Height',
              value: profile.height,
            })}

            {renderPersonalDetails({
              title: 'Diet',
              value: profile.diet,
            })}

            {renderPersonalDetails({
              title: 'Smoking',
              value: profile.smokingHabit,
            })}

            {renderPersonalDetails({
              title: 'Drinking',
              value: profile.drinkingHabit,
            })}

            {renderPersonalDetails({
              title: 'Blood Group',
              value: profile.bloodGroup,
            })}
          </View>
        </View>

        {/* Hobbies */}
        <InterestsSection
          title="Hobbies"
          items={profile.hobbies || []}
          dataSource={INTERESTS_DATA.hobbies}
        />

        {/* Sports & Fitness */}
        <InterestsSection
          title="Sports & Fitness"
          items={profile.sportsAndFitness || []}
          dataSource={INTERESTS_DATA.sportsAndFitness}
        />

        {/* Favorite Books */}
        <InterestsSection
          title="Favorite Books"
          items={profile.favoriteBooks || []}
          dataSource={INTERESTS_DATA.favoriteBooks}
        />

        {/* Favorite Movies */}
        <InterestsSection
          title="Favorite Movies"
          items={profile.favoriteMovies || []}
          dataSource={INTERESTS_DATA.favoriteMovies}
        />

        {/* Favorite Songs */}
        <InterestsSection
          title="Favorite Songs"
          items={profile.favoriteSongs || []}
          dataSource={INTERESTS_DATA.favoriteSongs}
        />

        {/* Vacation Destinations */}
        <InterestsSection
          title="Dream Vacation Destinations"
          items={profile.vacationDestination || []}
          dataSource={INTERESTS_DATA.vacationDestination}
        />
      </ScrollView>

      {/* Action Buttons */}
      <SwipeHandler
        handlePass={handlePass}
        handleShortlist={handleShortlist}
        handleLike={handleLike}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
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
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  profileImage: {
    width: width,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  verificationBadge: {
    paddingTop: 2,
    zIndex: 10,
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -70 }],
    marginBottom: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -6 }],
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#3B82F6',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  interestText: {
    fontSize: 14,
    color: '#E11D48',
    fontWeight: '500',
  },
});

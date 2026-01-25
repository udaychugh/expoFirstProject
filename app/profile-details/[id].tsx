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
  CheckCircle2,
  AlertCircle,
  InfoIcon,
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
import UserFirstDetail from '@/components/info/userFirstDetail';
import UserBio from '@/components/info/userBio';
import UserPersonalDetails from '@/components/info/userPersonalDetails';
import UserFamilyInfo from '@/components/info/userFamilyInfo';
import UserLocationInfo from '@/components/info/userLocationInfo';
import Clickable from '@/components/Clickable';
import { useAuth } from '@/contexts/AuthContext';
import CommonInfoModal from '@/components/CommonInfoModal';

const { width } = Dimensions.get('window');

export default function ProfileDetails() {
  const router = useRouter();

  const { id, hideButton, isShortlisted } = useLocalSearchParams();
  const { profile } = useAuth();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uProfile, setUProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCommonInfo, setShowCommonInfo] = useState(false);

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
        id as string,
      );
      if (response.success && response.data) {
        setUProfile(response.data);
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

        <Clickable
          onPress={() => {
            setShowCommonInfo(true);
          }}
        >
          <InfoIcon color="#1F2937" size={24} />
        </Clickable>
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

  if (error || !uProfile) {
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
      {uProfile.images?.map((_, index) => (
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
                event.nativeEvent.contentOffset.x / width,
              );
              setCurrentImageIndex(index);
            }}
          >
            {uProfile.images?.map((image: any, index: number) => (
              <AppImage
                key={index}
                src={image.url}
                style={styles.profileImage}
              />
            ))}
          </ScrollView>
          {renderImageIndicators()}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {uProfile.fullName}, {calculateAge(uProfile.dateOfBirth)}
            </Text>
            <Pressable
              onPress={() => {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2500);
              }}
              style={styles.verificationBadge}
            >
              {uProfile.isVerified ? (
                <CheckCircle2 size={20} fill="#3B82F6" />
              ) : (
                <AlertCircle size={20} fill="#F59E0B" />
              )}
              {showTooltip && (
                <View
                  style={[
                    styles.tooltipContainer,
                    !uProfile.isVerified && { backgroundColor: '#F59E0B' },
                  ]}
                >
                  <View
                    style={[
                      styles.tooltipArrow,
                      !uProfile.isVerified && { borderTopColor: '#F59E0B' },
                    ]}
                  />
                  <Text style={styles.tooltipText}>
                    {uProfile.isVerified
                      ? 'User verified'
                      : 'User verification pending'}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          <UserFirstDetail
            phone={uProfile.phone}
            email={uProfile.email}
            city={uProfile.location.city}
            state={uProfile.location.state}
            country={uProfile.location.country}
            isNRI={uProfile.isNRI}
            occupation={uProfile.occupation}
            education={uProfile.education}
            maritalStatus={uProfile.maritalStatus}
            manglik={uProfile.manglik}
          />
        </View>

        {/* About Section */}
        <UserBio bio={uProfile.bio} />

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <UserPersonalDetails
            religion={uProfile.religion}
            caste={uProfile.caste}
            height={uProfile.height}
            diet={uProfile.diet}
            smokingHabit={uProfile.smokingHabit}
            drinkingHabit={uProfile.drinkingHabit}
            bloodGroup={uProfile.bloodGroup}
            income={
              uProfile.annualSalary
                ? `${uProfile.annualSalary} ${uProfile.income.currency}`
                : 'Not mentioned'
            }
          />
        </View>

        {/* Location Info */}
        {uProfile.jobLocation || uProfile.permanentLocation ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            <UserLocationInfo
              jobLocation={uProfile.jobLocation}
              permanentLocation={uProfile.permanentLocation}
            />
          </View>
        ) : null}

        {/* Family Details */}
        {uProfile.familyDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Details</Text>
            <UserFamilyInfo
              fatherName={uProfile.familyDetails?.fatherName}
              fatherOccupation={uProfile.familyDetails?.fatherOccupation}
              motherName={uProfile.familyDetails?.motherName}
              motherOccupation={uProfile.familyDetails?.motherOccupation}
              familyIncome={uProfile.familyDetails?.familyIncome}
              siblings={uProfile.familyDetails?.siblings}
              createdBy={uProfile.familyDetails?.createdBy}
            />
          </View>
        )}

        {/* Languages Spoken */}
        <InterestsSection
          title="Languages Spoken"
          items={uProfile.languagesSpoken || []}
          dataSource={INTERESTS_DATA.languages}
        />

        {/* Hobbies */}
        <InterestsSection
          title="Hobbies"
          items={uProfile.hobbies || []}
          dataSource={INTERESTS_DATA.hobbies}
        />

        {/* Sports & Fitness */}
        <InterestsSection
          title="Sports & Fitness"
          items={uProfile.sportsAndFitness || []}
          dataSource={INTERESTS_DATA.sportsAndFitness}
        />

        {/* Favorite Books */}
        <InterestsSection
          title="Favorite Books"
          items={uProfile.favoriteBooks || []}
          dataSource={INTERESTS_DATA.favoriteBooks}
        />

        {/* Favorite Movies */}
        <InterestsSection
          title="Favorite Movies"
          items={uProfile.favoriteMovies || []}
          dataSource={INTERESTS_DATA.favoriteMovies}
        />

        {/* Favorite Songs */}
        <InterestsSection
          title="Favorite Songs"
          items={uProfile.favoriteSongs || []}
          dataSource={INTERESTS_DATA.favoriteSongs}
        />

        {/* Vacation Destinations */}
        <InterestsSection
          title="Dream Vacation Destinations"
          items={uProfile.vacationDestination || []}
          dataSource={INTERESTS_DATA.vacationDestination}
        />
      </ScrollView>

      <CommonInfoModal
        visible={showCommonInfo}
        onClose={() => setShowCommonInfo(false)}
        currentUser={profile}
        viewedUser={uProfile}
      />

      {/* Action Buttons */}
      {hideButton !== 'true' && (
        <SwipeHandler
          handlePass={handlePass}
          handleShortlist={handleShortlist}
          handleLike={handleLike}
          isShortlisted={isShortlisted === 'true'}
        />
      )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Pencil as Edit3,
  Camera,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  MessageCircle,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/assets/colors/colors';
import { calculateAge } from '@/utils/helper';
import NotVerified from '../tabsComp/profile/notVerified';
import Clickable from '@/components/Clickable';
import ActionImages from '../tabsComp/profile/actionImages';
import UserFirstDetail from '@/components/info/userFirstDetail';
import UserBio from '@/components/info/userBio';
import UserPersonalDetails from '@/components/info/userPersonalDetails';
import InterestsSection from '@/components/InterestsSection';
import { INTERESTS_DATA } from '@/utils/interestsData';
import UserFamilyInfo from '@/components/info/userFamilyInfo';
import UserLocationInfo from '@/components/info/userLocationInfo';

export default function Profile() {
  const router = useRouter();

  const { user, profile } = useAuth();
  const stats = 0;

  const handleEditProfile = () => {
    router.push('/editProfile/edit-profile');
  };

  const handleSettings = () => {
    router.push('/settings/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Clickable onPress={handleSettings}>
          <Settings color="#6B7280" size={24} />
        </Clickable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        {!user?.isVerified && (
          <NotVerified
            status={profile?.verificationStatus ?? 'not_submitted'}
          />
        )}

        {/* Profile Images */}
        <ActionImages
          imageOne={profile?.images[0].url}
          imageTwo={profile?.images[1].url}
        />

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {profile?.fullName}, {calculateAge(profile?.dateOfBirth ?? '')}
            </Text>
            <Clickable style={styles.editButton} onPress={handleEditProfile}>
              <Edit3 color="#E11D48" size={20} />
            </Clickable>
          </View>

          <UserFirstDetail
            city={profile?.location?.city}
            state={profile?.location?.state}
            country={profile?.location?.country}
            isNRI={profile?.isNRI}
            occupation={profile?.occupation}
            education={profile?.education}
            maritalStatus={profile?.maritalStatus}
            manglik={profile?.manglik}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats > 0 && (
            <View style={styles.statItem}>
              <Heart color={Colors.primary} size={24} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          )}

          {stats > 0 && (
            <View style={styles.statItem}>
              <Users color={Colors.pink} size={24} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
          )}

          {stats > 0 && (
            <View style={styles.statItem}>
              <MessageCircle color={Colors.purple} size={24} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          )}
        </View>

        {/* About Me */}
        <View style={[styles.section, { padding: 0 }]}>
          <UserBio bio={profile?.bio} />
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <UserPersonalDetails
            religion={profile?.religion}
            caste={profile?.caste}
            height={profile?.height}
            diet={profile?.diet}
            smokingHabit={profile?.smokingHabit}
            drinkingHabit={profile?.drinkingHabit}
            bloodGroup={profile?.bloodGroup}
            income={
              profile?.annualSalary
                ? `${profile?.annualSalary}`
                : 'Not mentioned'
            }
          />
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <UserLocationInfo
            jobLocation={profile?.jobLocation}
            permanentLocation={profile?.permanentLocation}
          />
        </View>

        {/* Family Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          <UserFamilyInfo
            fatherName={profile?.family?.fatherName}
            fatherOccupation={profile?.family?.fatherOccupation}
            motherName={profile?.family?.motherName}
            motherOccupation={profile?.family?.motherOccupation}
            familyIncome={profile?.family?.familyIncome}
            siblings={profile?.family?.siblings}
            createdBy={profile?.family?.createdBy}
          />
        </View>

        {/* Languages Spoken */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Languages Spoken"
            items={profile?.languagesSpoken || []}
            dataSource={INTERESTS_DATA.languages}
          />
        </View>

        {/* Hobbies */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Hobbies"
            items={profile?.hobbies || []}
            dataSource={INTERESTS_DATA.hobbies}
          />
        </View>

        {/* Sports & Fitness */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Sports & Fitness"
            items={profile?.sportsAndFitness || []}
            dataSource={INTERESTS_DATA.sportsAndFitness}
          />
        </View>

        {/* Favorite Books */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Favorite Books"
            items={profile?.favoriteBooks || []}
            dataSource={INTERESTS_DATA.favoriteBooks}
          />
        </View>

        {/* Favorite Movies */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Favorite Movies"
            items={profile?.favoriteMovies || []}
            dataSource={INTERESTS_DATA.favoriteMovies}
          />
        </View>

        {/* Favorite Songs */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Favorite Songs"
            items={profile?.favoriteSongs || []}
            dataSource={INTERESTS_DATA.favoriteSongs}
          />
        </View>

        {/* Vacation Destinations */}
        <View style={[styles.section, { padding: 0 }]}>
          <InterestsSection
            title="Dream Vacation Destinations"
            items={profile?.vacationDestination || []}
            dataSource={INTERESTS_DATA.vacationDestination}
          />
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  basicInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

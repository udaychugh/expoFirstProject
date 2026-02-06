import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Pencil as Edit3,
  Heart,
  Users,
  MessageCircle,
  Download,
  Bell,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
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
  const [isExporting, setIsExporting] = useState(false);

  const { profile } = useAuth();
  const stats = 0;

  const handleEditProfile = () => {
    router.push('/editProfile/edit-profile');
  };

  const handleSettings = () => {
    router.push('/settings/settings');
  };

  const handleExportBioData = async () => {
    try {
      setIsExporting(true);
      const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; background-color: #fff; -webkit-print-color-adjust: exact; }
      .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 40px; }
      .header {
        display: flex;
        gap: 30px;
        align-items: flex-start;
        text-align: left;
      }
      .header-left {
        width: 35%;
        text-align: center;
      }

      .header-right {
        width: 65%;
      }
      .profile-img-container { width: 150px; height: 150px; margin: 0 auto 15px; border-radius: 75px; overflow: hidden; border: 4px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); background-color: #eee; }
      .profile-img { width: 100%; height: 100%; object-fit: cover; }
      .name { font-size: 28px; font-weight: bold; color: #1F2937; margin-bottom: 5px; }
      .section { margin-bottom: 15px; margin-top: 15px; break-inside: avoid; }
      .section-title { font-size: 20px; font-weight: bold; color: #E11D48; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; }
      .row { margin-bottom: 15px; font-size: 14px; line-height: 1.5; }
      .label { font-weight: 700; color: #555; display: inline-block; min-width: 130px; }
      .value { color: #111; font-weight: 400; }
      .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #6B7280; border-top: 1px solid #eee; padding-top: 20px; }
      .footer-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
      .app-link { color: #E11D48; text-decoration: none; font-weight: bold; }
      .logo-text { font-weight: 900; color: #E11D48; font-size: 18px; margin-bottom: 5px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="profile-img-container">
            ${profile?.images?.[0]?.url ? `<img src="${profile.images[0].url}" class="profile-img" />` : ''}
          </div>
          <div class="name">
            ${profile?.fullName || 'N/A'}, ${calculateAge(profile?.dateOfBirth ?? '')}
          </div>
        </div>

        <div class="header-right">
          <div class="section-title">Basic Information</div>
          <div class="row"><span class="label">Location:</span> <span class="value">${profile?.location?.city || '-'}, ${profile?.location?.state || '-'}, ${profile?.location?.country || '-'}</span></div>
            <div class="row"><span class="label">Occupation:</span> <span class="value">${profile?.occupation || '-'}</span></div>
            <div class="row"><span class="label">Education:</span> <span class="value">${profile?.education || '-'}</span></div>
            <div class="row"><span class="label">Marital Status:</span> <span class="value">${profile?.maritalStatus || '-'}</span></div>
            <div class="row"><span class="label">Manglik:</span> <span class="value">${profile?.manglik === true ? 'Manglik' : 'Non-Manglik'}</span></div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Personal Details</div>
        <div class="grid">
          <div class="row"><span class="label">Religion:</span> <span class="value">${profile?.religion || '-'}</span></div>
          <div class="row"><span class="label">Caste:</span> <span class="value">${profile?.caste || '-'}</span></div>
          <div class="row"><span class="label">Height:</span> <span class="value">${profile?.height || '-'}</span></div>
          <div class="row"><span class="label">Diet:</span> <span class="value">${profile?.diet || '-'}</span></div>
          <div class="row"><span class="label">Smoking:</span> <span class="value">${profile?.smokingHabit || '-'}</span></div>
          <div class="row"><span class="label">Drinking:</span> <span class="value">${profile?.drinkingHabit || '-'}</span></div>
          <div class="row"><span class="label">Blood Group:</span> <span class="value">${profile?.bloodGroup || '-'}</span></div>
          <div class="row"><span class="label">Income:</span> <span class="value">${profile?.annualSalary ? `${profile?.annualSalary}` : 'Not mentioned'}</span></div>
        </div>
      </div>

       <div class="section">
        <div class="section-title">Location Details</div>
        <div class="grid">
             <div class="row"><span class="label">Job Location:</span> <span class="value">${profile?.jobLocation || '-'}</span></div>
             <div class="row"><span class="label">Permanent Location:</span> <span class="value">${profile?.permanentLocation || '-'}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Family Details</div>
        <div class="grid">
          <div class="row"><span class="label">Father:</span> <span class="value">${profile?.familyDetails?.fatherName || '-'} (${profile?.familyDetails?.fatherOccupation || '-'})</span></div>
          <div class="row"><span class="label">Mother:</span> <span class="value">${profile?.familyDetails?.motherName || '-'} (${profile?.familyDetails?.motherOccupation || '-'})</span></div>
          <div class="row"><span class="label">Family Income:</span> <span class="value">${profile?.familyDetails?.familyIncome || '-'}</span></div>
          <div class="row"><span class="label">Siblings:</span> <span class="value">${profile?.familyDetails?.siblings.length || '-'} Sibling(s)</span></div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-content">
           <span class="logo-text"><a href="https://lifematch.in" class="app-link">Life Match</a></span>
           <span>Create your free bio data using <a href="https://lifematch.in" class="app-link">Life Match</a> for free.</span>
        </div>
      </div>
    </div>
  </body>
</html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      const filename = `Biodata_${profile?.fullName?.replace(/\s+/g, '_') || 'User'}.pdf`;
      const newUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(newUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        });
      } else {
        await Sharing.shareAsync(newUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast here for error
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <Clickable onPress={() => router.push('/notification/notifications')}>
            <Bell color="#6B7280" size={24} />
          </Clickable>
          <Clickable onPress={handleSettings}>
            <Settings color="#6B7280" size={24} />
          </Clickable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        {!profile?.isVerified && (
          <NotVerified
            status={profile?.verificationStatus ?? 'not_submitted'}
          />
        )}

        {/* Profile Images */}
        <ActionImages
          imageOne={profile?.images[0]?.url}
          imageTwo={profile?.images[1]?.url}
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

          <View style={styles.separator} />

          <Clickable
            style={styles.exportButton}
            onPress={handleExportBioData}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Download color="#FFFFFF" size={20} />
                <Text style={styles.exportButtonText}>Download Bio Data</Text>
              </>
            )}
          </Clickable>
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
            fatherName={profile?.familyDetails?.fatherName}
            fatherOccupation={profile?.familyDetails?.fatherOccupation}
            motherName={profile?.familyDetails?.motherName}
            motherOccupation={profile?.familyDetails?.motherOccupation}
            familyIncome={profile?.familyDetails?.familyIncome}
            siblings={profile?.familyDetails?.siblings}
            createdBy={profile?.familyDetails?.createdBy}
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
    flex: 1,
    marginRight: 8,
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
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

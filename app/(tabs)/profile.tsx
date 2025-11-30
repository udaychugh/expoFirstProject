import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  CreditCard as Edit3,
  Camera,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  MessageCircle,
  LogOut,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInfo } from '@/services/db/dataManager';
import { UserProfile } from '@/contexts/model/userProfile';
import ApiService from '@/services/api';

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);

  const { logout, user: authUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await ApiService.getCurrentUserProfile();
      if (response.success && response.data) {
        await getUserInfo().then((data) => {
          setUser(data);
        });
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleVerification = () => {
    router.push('/verification');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      router.push('/(onboarding)/welcome');
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.push('/(onboarding)/welcome');
          },
        },
      ]);
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Settings color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        {!authUser?.isVerified && (
          <View style={styles.verificationBanner}>
            <View style={styles.verificationContent}>
              <AlertTriangle color="#F59E0B" size={24} />
              <View style={styles.verificationText}>
                <Text style={styles.verificationTitle}>
                  Account Not Verified
                </Text>
                <Text style={styles.verificationSubtitle}>
                  Complete verification to gain trust and get more matches
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.verificationButton}
              onPress={handleVerification}
            >
              <Text style={styles.verificationButtonText}>
                Complete Verification
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {authUser?.isVerified && (
          <View style={styles.verifiedBanner}>
            <CheckCircle color="#10B981" size={24} />
            <Text style={styles.verifiedText}>Account Verified</Text>
          </View>
        )}

        {/* Profile Images */}
        <View style={styles.imagesContainer}>
          <View style={styles.mainImageContainer}>
            <Image source={{ uri: user?.images[0] }} style={styles.mainImage} />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>

          {user?.images[1] && (
            <View style={styles.secondaryImageContainer}>
              <Image
                source={{ uri: user?.images[1] }}
                style={styles.secondaryImage}
              />
            </View>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {authUser?.fullName || user?.name}, {user?.age}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Edit3 color="#E11D48" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <MapPin color="#6B7280" size={16} />
            <Text style={styles.infoText}>
              {JSON.stringify(user?.location)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Briefcase color="#6B7280" size={16} />
            <Text style={styles.infoText}>{user?.occupation}</Text>
          </View>

          <View style={styles.infoRow}>
            <GraduationCap color="#6B7280" size={16} />
            <Text style={styles.infoText}>{user?.education}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Heart color="#E11D48" size={24} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>

          <View style={styles.statItem}>
            <Users color="#EC4899" size={24} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>

          <View style={styles.statItem}>
            <MessageCircle color="#8B5CF6" size={24} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        {/* About Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{user?.bio}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Religion</Text>
            <Text style={styles.detailValue}>{user?.religion}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Height</Text>
            <Text style={styles.detailValue}>{user?.height}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Edit3 color="#FFFFFF" size={20} />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  verificationBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationText: {
    flex: 1,
    marginLeft: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#92400E',
    marginTop: 2,
  },
  verificationButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  mainImageContainer: {
    flex: 2,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: '#E11D48',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryImageContainer: {
    flex: 1,
  },
  secondaryImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
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

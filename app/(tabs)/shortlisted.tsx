import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  X,
  Pin,
  PinOff,
} from 'lucide-react-native';
import AppImage from '@/components/AppImage';
import { useRouter, useFocusEffect } from 'expo-router';
import { ShowAlert } from '@/components/Alert';
import ApiService from '@/services/api';
import { UserProfile } from '@/contexts/model/userProfile';
import { calculateAge } from '@/utils/helper';

interface ShortlistProfile extends UserProfile {
  isPinned?: boolean;
}

export default function Shortlisted() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ShortlistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadShortlistedProfiles();
    }, [])
  );

  const loadShortlistedProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getShortlistedProfiles();
      if (response.success && response.data) {
        // Preserve pinned state if possible, or just reset
        // For now, valid profiles from API
        const newProfiles = response.data.map((p) => ({
          ...p,
          isPinned: false, // Default to false unless we persist it elsewhere
        }));
        setProfiles(newProfiles);
      } else {
        setError(response.error || 'Failed to load shortlisted profiles');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pinnedProfiles = profiles.filter((p) => p.isPinned);
  const unpinnedProfiles = profiles.filter((p) => !p.isPinned);
  const sortedProfiles = [...pinnedProfiles, ...unpinnedProfiles];

  const handleUnmark = async (id: string) => {
    // Optimistic update
    const profileToRemove = profiles.find((p) => p.id === id);
    if (!profileToRemove) return;

    // Temporarily remove from state
    setProfiles((prev) => prev.filter((profile) => profile.id !== id));

    try {
      const response = await ApiService.removeShortlistedProfile(id);
      
      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Removed from Shortlist',
          message: `${profileToRemove.fullName} has been removed from your shortlist.`,
        });
      } else {
         // Revert on API failure
         setProfiles((prev) => [...prev, profileToRemove]);
         ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to remove profile from shortlist',
        });
      }
    } catch (e) {
      // Revert on network error
      setProfiles((prev) => [...prev, profileToRemove]);
      ShowAlert({
         type: 'error',
         title: 'Error',
         message: 'Network error. Please try again.',
       });
    }
  };

  const handlePin = (id: string) => {
    setProfiles((prev) => {
      const profile = prev.find((p) => p.id === id);
      if (!profile) return prev;

      if (profile.isPinned) {
        // Unpin
        return prev.map((p) => (p.id === id ? { ...p, isPinned: false } : p));
      } else {
        // Check if already 3 pinned
        const pinnedCount = prev.filter((p) => p.isPinned).length;
        if (pinnedCount >= 3) {
          ShowAlert({
            type: 'error',
            title: 'Maximum Pins Reached',
            message:
              'You can only pin up to 3 profiles. Please unpin another profile first.',
          });
          return prev;
        }
        // Pin
        return prev.map((p) => (p.id === id ? { ...p, isPinned: true } : p));
      }
    });
  };

  const handleProfilePress = (id: string) => {
    router.push(`/profile-details/${id}`);
  };

  const renderProfileCard = ({ item }: { item: ShortlistProfile }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        item.isPinned && styles.pinnedCard,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => handleProfilePress(item.id)}
    >
      {/* Pin Badge */}
      {item.isPinned && (
        <View style={styles.pinBadge}>
          <Pin size={14} color="#FFFFFF" fill="#E11D48" />
        </View>
      )}

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <AppImage src={item.mainImage} style={styles.profileImage} />
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {item.fullName}, {item.age || calculateAge(item.dateOfBirth)}
        </Text>

        <View style={styles.detailRow}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location?.city}, {item.location?.state}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Briefcase size={14} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.occupation}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <GraduationCap size={14} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.education}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.pinButton,
            item.isPinned && styles.pinnedButton,
            pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          ]}
          onPress={() => handlePin(item.id)}
        >
          {item.isPinned ? (
            <PinOff size={18} color="#E11D48" />
          ) : (
            <Pin size={18} color="#6B7280" />
          )}
          <Text
            style={[
              styles.actionButtonText,
              item.isPinned && styles.pinnedButtonText,
            ]}
          >
            {item.isPinned ? 'Unpin' : 'Pin'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.removeButton,
            pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          ]}
          onPress={() => handleUnmark(item.id)}
        >
          <X size={18} color="#EF4444" />
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Shortlisted Profiles</Text>
      <Text style={styles.emptyMessage}>
        Your shortlisted profiles will appear here
      </Text>
    </View>
  );

  if (loading && profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E11D48" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shortlist</Text>
        <Text style={styles.headerSubtitle}>
          {profiles.length > 0
            ? `${profiles.length} profile${
                profiles.length !== 1 ? 's' : ''
              } • ${pinnedProfiles.length}/3 pinned`
            : 'Your shortlisted profiles will appear here'}
        </Text>
      </View>

      {/* Profile List */}
      <FlatList
        data={sortedProfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfileCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadShortlistedProfiles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  pinnedCard: {
    borderWidth: 2,
    borderColor: '#E11D48',
  },
  pinBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E11D48',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  pinButton: {
    backgroundColor: '#F3F4F6',
  },
  pinnedButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  pinnedButtonText: {
    color: '#E11D48',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

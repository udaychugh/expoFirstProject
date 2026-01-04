import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Check,
  X,
  Ban,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import ApiService from '@/services/api';
import AppImage from '@/components/AppImage';
import { ShowAlert } from '@/components/Alert';
import { calculateAge } from '@/utils/helper';
import { ConnectionResponse } from '@/contexts/model/connectionResponse';

export default function Matches() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Sent' | 'Received'>('Received');
  const [sentConnections, setSentConnections] = useState<ConnectionResponse[]>(
    []
  );
  const [receivedConnections, setReceivedConnections] = useState<
    ConnectionResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadConnections(activeTab);
    }, [activeTab])
  );

  const loadConnections = async (tab: 'Sent' | 'Received') => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'Sent') {
        const response = await ApiService.getSentConnections();
        if (response.success && response.data) {
          setSentConnections(
            response.data.filter((item) => item.status !== 'cancelled')
          );
        } else {
          setError(response.error || 'Failed to load sent connections');
        }
      } else {
        const response = await ApiService.getReceivedConnections();
        if (response.success && response.data) {
          setReceivedConnections(
            response.data.filter((item) => item.status !== 'cancelled')
          );
        } else {
          setError(response.error || 'Failed to load received connections');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayProfile = (connection: ConnectionResponse) => {
    if (activeTab === 'Sent') return connection.to;
    return connection.from || connection.to;
  };

  const handleAccept = async (id: string, name: string, profileId: string) => {
    try {
      const response = await ApiService.acceptConnection(id);
      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Connection Accepted',
          message: `You are now connected with ${name}`,
        });
        router.push(`/profile-details/${profileId}?hideButton=true`);
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to accept',
        });
      }
    } catch (error) {
      ShowAlert({ type: 'error', title: 'Error', message: 'Network error' });
    }
  };

  const handleReject = async (id: string) => {
    // Optimistic update
    const connection = receivedConnections.find((c) => c.id === id);
    setReceivedConnections((prev) => prev.filter((c) => c.id !== id));

    try {
      const response = await ApiService.rejectConnection(id);
      if (!response.success) {
        if (connection) setReceivedConnections((prev) => [...prev, connection]);
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to reject',
        });
      }
    } catch (error) {
      if (connection) setReceivedConnections((prev) => [...prev, connection]);
      ShowAlert({ type: 'error', title: 'Error', message: 'Network error' });
    }
  };

  const handleCancel = async (id: string) => {
    // Optimistic update
    const connection = sentConnections.find((c) => c.id === id);
    setSentConnections((prev) => prev.filter((c) => c.id !== id));

    try {
      const response = await ApiService.cancelConnection(id);
      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Request Cancelled',
          message: 'Connection request cancelled successfully',
        });
      } else {
        if (connection) setSentConnections((prev) => [...prev, connection]);
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to cancel',
        });
      }
    } catch (error) {
      if (connection) setSentConnections((prev) => [...prev, connection]);
      ShowAlert({ type: 'error', title: 'Error', message: 'Network error' });
    }
  };

  const renderConnectionItem = (item: ConnectionResponse) => {
    const profile = getDisplayProfile(item);

    // Ensure profile exists to avoid crashes
    if (!profile) return null;

    const isAccepted = item.status === 'accepted';
    const isSentRejected = item.status === 'rejected';

    return (
      <View key={item.id} style={styles.connectionCard}>
        <Pressable
          onPress={() =>
            router.push(`/profile-details/${profile.id}?hideButton=true`)
          }
          style={styles.profileContainer}
        >
          <AppImage
            src={profile.mainImage || undefined}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {profile.fullName},{' '}
              {profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : 'N/A'}
            </Text>
            {profile.email && (
              <View style={styles.locationRow}>
                <Mail color="#6B7280" size={14} />
                <Text style={styles.locationText}>{profile.email}</Text>
              </View>
            )}
            {profile.phone && (
              <View style={styles.locationRow}>
                <Phone color="#6B7280" size={14} />
                <Text style={styles.locationText}>{profile.phone}</Text>
              </View>
            )}
            <View style={styles.locationRow}>
              <MapPin color="#6B7280" size={14} />
              <Text style={styles.locationText}>
                {profile.location?.city || 'Unknown'},{' '}
                {profile.location?.state || ''}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Briefcase color="#6B7280" size={14} />
              <Text style={styles.occupation} numberOfLines={1}>
                {profile.occupation || 'Not specified'}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <GraduationCap color="#6B7280" size={14} />
              <Text style={styles.occupation} numberOfLines={1}>
                {profile.education || 'Not specified'}
              </Text>
            </View>
          </View>
        </Pressable>

        {isAccepted ? (
          <View style={[styles.actionContainer, styles.statusContainer]}>
            <Check color="#10B981" size={20} />
            <Text style={styles.statusTextAccepted}>Accepted</Text>
          </View>
        ) : isSentRejected ? (
          <View style={[styles.actionContainer, styles.statusContainer]}>
            <X color="#EF4444" size={20} />
            <Text style={styles.statusTextRejected}>Rejected</Text>
          </View>
        ) : (
          <View style={styles.actionContainer}>
            {activeTab === 'Received' ? (
              <>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(item.id)}
                >
                  <X color="#EF4444" size={20} />
                  <Text style={styles.rejectText}>Reject</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() =>
                    handleAccept(item.id, profile.fullName, profile.id)
                  }
                >
                  <Check color="#FFFFFF" size={20} />
                  <Text style={styles.acceptText}>Accept</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancel(item.id)}
              >
                <Ban color="#6B7280" size={20} />
                <Text style={styles.cancelText}>Cancel Request</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
        <Text style={styles.headerSubtitle}>
          Manage your connection requests
        </Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'Received' && styles.activeTab]}
          onPress={() => setActiveTab('Received')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Received' && styles.activeTabText,
            ]}
          >
            Received
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'Sent' && styles.activeTab]}
          onPress={() => setActiveTab('Sent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Sent' && styles.activeTabText,
            ]}
          >
            Sent
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E11D48" />
            <Text style={styles.loadingText}>Loading connections...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => loadConnections(activeTab)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {activeTab === 'Received' ? (
              receivedConnections.length > 0 ? (
                receivedConnections.map(renderConnectionItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No received requests</Text>
                  <Text style={styles.emptyText}>
                    You haven't received any connection requests yet.
                  </Text>
                </View>
              )
            ) : sentConnections.length > 0 ? (
              sentConnections.map(renderConnectionItem)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No sent requests</Text>
                <Text style={styles.emptyText}>
                  You haven't sent any connection requests yet.
                </Text>
              </View>
            )}
          </View>
        )}
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#E11D48',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
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
  connectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  occupation: {
    fontSize: 14,
    color: '#4B5563',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#E11D48',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statusContainer: {
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
  },
  statusTextAccepted: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  statusTextRejected: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});

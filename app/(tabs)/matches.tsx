import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, MapPin, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ApiService from '@/services/api';

export default function Matches() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'new' | 'all'>('new');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    // setLoading(true);
    // setError(null);
    // try {
    //   const response = await ApiService.getMatches();
    //   if (response.success && response.data) {
    //     setMatches(response.data);
    //   } else {
    //     setError(response.error || 'Failed to load matches');
    //   }
    // } catch (err) {
    //   setError('Network error. Please try again.');
    // } finally {
    //   setLoading(false);
    // }

    setError("No matches found")
  };

  const newMatches = matches.filter(match => match.unread);
  const allMatches = matches;

  const handleChatPress = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  const renderMatch = (match: any) => (
    <TouchableOpacity
      key={match.id}
      style={[styles.matchCard, match.unread && styles.unreadMatch]}
      onPress={() => handleChatPress(match.id)}
    >
      <Image source={{ uri: match.image }} style={styles.matchImage} />
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{match.name}, {match.age}</Text>
          {match.unread && <View style={styles.unreadDot} />}
        </View>
        
        <View style={styles.locationRow}>
          <MapPin color="#6B7280" size={14} />
          <Text style={styles.locationText}>{match.location}</Text>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {match.lastMessage}
        </Text>
        
        <View style={styles.timeRow}>
          <Clock color="#9CA3AF" size={12} />
          <Text style={styles.timeText}>{match.matchedAt}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => handleChatPress(match.id)}
      >
        <MessageCircle color="#E11D48" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>People who liked you back</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            New ({newMatches.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({allMatches.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading matches...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadMatches}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === 'new' ? (
          newMatches.length > 0 ? (
            newMatches.map(renderMatch)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No new matches yet</Text>
              <Text style={styles.emptyText}>Keep swiping to find more people who might be interested in you!</Text>
            </View>
          )
        ) : (
          allMatches.length > 0 ? (
            allMatches.map(renderMatch)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No matches yet</Text>
              <Text style={styles.emptyText}>Start exploring profiles to find your perfect match!</Text>
            </View>
          )
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
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
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
  matchCard: {
    flexDirection: 'row',
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
  unreadMatch: {
    borderLeftWidth: 4,
    borderLeftColor: '#E11D48',
  },
  matchImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  lastMessage: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
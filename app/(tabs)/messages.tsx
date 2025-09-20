import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MessageCircle, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    name: 'Priya Sharma',
    image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Hi! Thanks for connecting with me 😊',
    timestamp: '2:30 PM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Anita Patel',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Would love to know more about your interests',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Meera Singh',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Nice to meet you!',
    timestamp: '3 days ago',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Kavya Reddy',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Looking forward to getting to know you better',
    timestamp: '1 week ago',
    unread: 0,
    online: true,
  },
];

export default function Messages() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const renderConversation = (conversation: any) => (
    <TouchableOpacity
      key={conversation.id}
      style={styles.conversationCard}
      onPress={() => handleChatPress(conversation.id)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: conversation.image }} style={styles.avatar} />
        {conversation.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {conversation.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{conversation.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Chat with your matches</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView style={styles.conversations} showsVerticalScrollIndicator={false}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map(renderConversation)
        ) : (
          <View style={styles.emptyState}>
            {searchQuery ? (
              <>
                <Text style={styles.emptyTitle}>No conversations found</Text>
                <Text style={styles.emptyText}>Try searching with a different name</Text>
              </>
            ) : (
              <>
                <MessageCircle color="#9CA3AF" size={64} />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptyText}>
                  When you match with someone, you'll be able to chat with them here
                </Text>
              </>
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  conversations: {
    flex: 1,
    paddingHorizontal: 24,
  },
  conversationCard: {
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
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#E11D48',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
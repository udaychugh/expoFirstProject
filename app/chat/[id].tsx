import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Phone, Video, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock chat data
const mockMessages = [
  {
    id: '1',
    text: 'Hi! Thanks for connecting with me 😊',
    sender: 'other',
    timestamp: '2:30 PM',
  },
  {
    id: '2',
    text: 'Hello! Nice to meet you too. I really liked your profile.',
    sender: 'me',
    timestamp: '2:32 PM',
  },
  {
    id: '3',
    text: 'Thank you! I saw that you work in tech as well. What kind of projects do you work on?',
    sender: 'other',
    timestamp: '2:35 PM',
  },
  {
    id: '4',
    text: 'I mainly work on mobile applications and web development. Currently building a fintech app. What about you?',
    sender: 'me',
    timestamp: '2:37 PM',
  },
  {
    id: '5',
    text: 'That sounds interesting! I work on backend systems for e-commerce platforms. Would love to know more about your fintech project.',
    sender: 'other',
    timestamp: '2:40 PM',
  },
];

const mockUser = {
  name: 'Priya Sharma',
  online: true,
};

export default function Chat() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = (message: any) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.sender === 'me' ? styles.myMessage : styles.otherMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        message.sender === 'me' ? styles.myMessageText : styles.otherMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userStatus}>
            {mockUser.online ? 'Online' : 'Last seen 2h ago'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone color="#6B7280" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Video color="#6B7280" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, newMessage.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send 
              color={newMessage.trim() ? '#FFFFFF' : '#9CA3AF'} 
              size={20} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userStatus: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E11D48',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#E11D48',
  },
});
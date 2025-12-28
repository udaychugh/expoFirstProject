import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AccountSettings from './components/AccountSettings';
import NotificationSettings from './components/NotificationSettings';
import PrivacySettings from './components/PrivacySettings';
import PreferencesSettings from './components/PreferencesSettings';
import SupportSettings from './components/SupportSettings';
import AccountActions from './components/AccountActions';

export default function Settings() {
  const router = useRouter();

  const { logout } = useAuth();

  const [settings, setSettings] = useState({
    notifications: {
      newMatches: true,
      messages: true,
      profileViews: false,
      marketing: false,
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: false,
      profileVisibility: true,
    },
    preferences: {
      darkMode: false,
      language: 'English',
    },
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !(prev[category as keyof typeof prev] as any)[setting],
      },
    }));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.push('/(onboarding)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Account deleted'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AccountSettings />

        {/* <NotificationSettings
          settings={settings.notifications}
          onToggle={(setting) => handleToggle('notifications', setting)}
        /> */}

        {/* <PrivacySettings
          settings={settings.privacy}
          onToggle={(setting) => handleToggle('privacy', setting)}
        /> */}

        <PreferencesSettings
          settings={settings.preferences}
          onToggle={(setting) => handleToggle('preferences', setting)}
        />

        <SupportSettings />

        <AccountActions
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
});

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
import PreferencesSettings from './components/PreferencesSettings';
import SupportSettings from './components/SupportSettings';
import AccountActions from './components/AccountActions';
import DeleteAccountModal from './components/DeleteAccountModal';
import LogoutModal from './components/LogoutModal';

export default function Settings() {
  const router = useRouter();

  const { logout, deleteAccount } = useAuth();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setLogoutModalVisible(false);
      router.push('/(onboarding)/login');
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async (reason: string) => {
    try {
      setIsDeleting(true);
      await deleteAccount(reason);
      setDeleteModalVisible(false);
      router.replace('/(onboarding)/login');
    } catch (error) {
      console.error('Delete account failed', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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

      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleConfirmDelete}
        loading={isDeleting}
      />

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onLogout={handleConfirmLogout}
        loading={isLoggingOut}
      />
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

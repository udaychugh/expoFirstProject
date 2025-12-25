import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Eye,
  Heart,
  MessageCircle,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Lock,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

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

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showToggle = false,
    toggleValue = false,
    onToggle,
    showArrow = true,
    danger = false,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
    showArrow?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.settingLeft}>
        <View
          style={[styles.iconContainer, danger && styles.dangerIconContainer]}
        >
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {showToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
            thumbColor={toggleValue ? '#E11D48' : '#FFFFFF'}
          />
        ) : showArrow ? (
          <ChevronRight color="#9CA3AF" size={20} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

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
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<User color="#6B7280" size={20} />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push('/edit-profile')}
            />
            <SettingItem
              icon={<Shield color="#6B7280" size={20} />}
              title="Account Verification"
              subtitle="Verify your identity"
              onPress={() => router.push('/verification')}
            />
            <SettingItem
              icon={<Lock color="#6B7280" size={20} />}
              title="Change Password"
              subtitle="Update your password"
              onPress={() =>
                Alert.alert(
                  'Change Password',
                  'Password change functionality would be implemented here'
                )
              }
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Heart color="#6B7280" size={20} />}
              title="New Matches"
              subtitle="Get notified when someone likes you"
              showToggle
              toggleValue={settings.notifications.newMatches}
              onToggle={() => handleToggle('notifications', 'newMatches')}
            />
            <SettingItem
              icon={<MessageCircle color="#6B7280" size={20} />}
              title="Messages"
              subtitle="Get notified about new messages"
              showToggle
              toggleValue={settings.notifications.messages}
              onToggle={() => handleToggle('notifications', 'messages')}
            />
            <SettingItem
              icon={<Eye color="#6B7280" size={20} />}
              title="Profile Views"
              subtitle="Get notified when someone views your profile"
              showToggle
              toggleValue={settings.notifications.profileViews}
              onToggle={() => handleToggle('notifications', 'profileViews')}
            />
            <SettingItem
              icon={<Bell color="#6B7280" size={20} />}
              title="Marketing"
              subtitle="Receive promotional notifications"
              showToggle
              toggleValue={settings.notifications.marketing}
              onToggle={() => handleToggle('notifications', 'marketing')}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Globe color="#6B7280" size={20} />}
              title="Show Online Status"
              subtitle="Let others see when you're online"
              showToggle
              toggleValue={settings.privacy.showOnlineStatus}
              onToggle={() => handleToggle('privacy', 'showOnlineStatus')}
            />
            <SettingItem
              icon={<Eye color="#6B7280" size={20} />}
              title="Show Last Seen"
              subtitle="Let others see when you were last active"
              showToggle
              toggleValue={settings.privacy.showLastSeen}
              onToggle={() => handleToggle('privacy', 'showLastSeen')}
            />
            <SettingItem
              icon={<User color="#6B7280" size={20} />}
              title="Profile Visibility"
              subtitle="Make your profile visible to others"
              showToggle
              toggleValue={settings.privacy.profileVisibility}
              onToggle={() => handleToggle('privacy', 'profileVisibility')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Moon color="#6B7280" size={20} />}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              showToggle
              toggleValue={settings.preferences.darkMode}
              onToggle={() => handleToggle('preferences', 'darkMode')}
            />
            <SettingItem
              icon={<Globe color="#6B7280" size={20} />}
              title="Language"
              subtitle="English"
              onPress={() =>
                Alert.alert(
                  'Language',
                  'Language selection would be implemented here'
                )
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<HelpCircle color="#6B7280" size={20} />}
              title="Help & Support"
              subtitle="Get help or contact support"
              onPress={() =>
                Alert.alert(
                  'Help & Support',
                  'Support functionality would be implemented here'
                )
              }
            />
            <SettingItem
              icon={<Shield color="#6B7280" size={20} />}
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() =>
                Alert.alert(
                  'Privacy Policy',
                  'Privacy policy would be displayed here'
                )
              }
            />
            <SettingItem
              icon={<Shield color="#6B7280" size={20} />}
              title="Terms of Service"
              subtitle="Read our terms of service"
              onPress={() =>
                Alert.alert(
                  'Terms of Service',
                  'Terms of service would be displayed here'
                )
              }
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<LogOut color="#EF4444" size={20} />}
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
            <SettingItem
              icon={<User color="#EF4444" size={20} />}
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              showArrow={false}
              danger
            />
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dangerIconContainer: {
    backgroundColor: '#FEF2F2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  dangerText: {
    color: '#EF4444',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

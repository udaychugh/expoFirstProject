import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Eye, Bell } from 'lucide-react-native';
import SettingItem from './core/settingItem';

interface NotificationSettingsProps {
  settings: {
    newMatches: boolean;
    messages: boolean;
    profileViews: boolean;
    marketing: boolean;
  };
  onToggle: (setting: string) => void;
}

export default function NotificationSettings({
  settings,
  onToggle,
}: NotificationSettingsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.sectionContent}>
        <SettingItem
          icon={<Heart color="#6B7280" size={20} />}
          title="New Matches"
          subtitle="Get notified when someone likes you"
          showToggle
          toggleValue={settings.newMatches}
          onToggle={() => onToggle('newMatches')}
        />
        <SettingItem
          icon={<MessageCircle color="#6B7280" size={20} />}
          title="Messages"
          subtitle="Get notified about new messages"
          showToggle
          toggleValue={settings.messages}
          onToggle={() => onToggle('messages')}
        />
        <SettingItem
          icon={<Eye color="#6B7280" size={20} />}
          title="Profile Views"
          subtitle="Get notified when someone views your profile"
          showToggle
          toggleValue={settings.profileViews}
          onToggle={() => onToggle('profileViews')}
        />
        <SettingItem
          icon={<Bell color="#6B7280" size={20} />}
          title="Marketing"
          subtitle="Receive promotional notifications"
          showToggle
          toggleValue={settings.marketing}
          onToggle={() => onToggle('marketing')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

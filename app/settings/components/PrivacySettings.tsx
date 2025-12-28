import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Globe, Eye, User } from 'lucide-react-native';
import SettingItem from './core/settingItem';

interface PrivacySettingsProps {
  settings: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    profileVisibility: boolean;
  };
  onToggle: (setting: string) => void;
}

export default function PrivacySettings({
  settings,
  onToggle,
}: PrivacySettingsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Privacy</Text>
      <View style={styles.sectionContent}>
        <SettingItem
          icon={<Globe color="#6B7280" size={20} />}
          title="Show Online Status"
          subtitle="Let others see when you're online"
          showToggle
          toggleValue={settings.showOnlineStatus}
          onToggle={() => onToggle('showOnlineStatus')}
        />
        <SettingItem
          icon={<Eye color="#6B7280" size={20} />}
          title="Show Last Seen"
          subtitle="Let others see when you were last active"
          showToggle
          toggleValue={settings.showLastSeen}
          onToggle={() => onToggle('showLastSeen')}
        />
        <SettingItem
          icon={<User color="#6B7280" size={20} />}
          title="Profile Visibility"
          subtitle="Make your profile visible to others"
          showToggle
          toggleValue={settings.profileVisibility}
          onToggle={() => onToggle('profileVisibility')}
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

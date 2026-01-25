import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Moon, Globe, Presentation } from 'lucide-react-native';
import SettingItem from './core/settingItem';
import { useRouter } from 'expo-router';

interface PreferencesSettingsProps {
  settings: {
    darkMode: boolean;
    language: string;
  };
  onToggle: (setting: string) => void;
}

export default function PreferencesSettings({
  settings,
  onToggle,
}: PreferencesSettingsProps) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.sectionContent}>
        {/* <SettingItem
          icon={<Moon color="#6B7280" size={20} />}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          showToggle
          toggleValue={settings.darkMode}
          onToggle={() => onToggle('darkMode')}
        /> */}
        <SettingItem
          icon={<Presentation color="#6B7280" size={20} />}
          title="Match Preferences"
          subtitle="Update your match preferences"
          onPress={() => router.push('/match-preferences/match-preferences')}
        />
        <SettingItem
          icon={<Globe color="#6B7280" size={20} />}
          title="Language"
          subtitle={settings.language}
          onPress={() =>
            Alert.alert(
              'Language',
              'Currently English is the only language available',
            )
          }
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

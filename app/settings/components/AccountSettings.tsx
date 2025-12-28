import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { User, Shield, Lock, Pause } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SettingItem from './core/settingItem';

export default function AccountSettings() {
  const router = useRouter();

  return (
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
          onPress={() => router.push('/verification/verification')}
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
        <SettingItem
          icon={<Pause color="#6B7280" size={20} />}
          title="Pause Account"
          subtitle="Pause your account"
          onPress={() =>
            Alert.alert(
              'Pause Account',
              'Pause functionality would be implemented here'
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

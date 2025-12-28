import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LogOut, User } from 'lucide-react-native';
import SettingItem from './core/settingItem';

interface AccountActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function AccountActions({
  onLogout,
  onDeleteAccount,
}: AccountActionsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View style={styles.sectionContent}>
        <SettingItem
          icon={<LogOut color="#EF4444" size={20} />}
          title="Logout"
          subtitle="Sign out of your account"
          onPress={onLogout}
          showArrow={false}
          danger
        />
        <SettingItem
          icon={<User color="#EF4444" size={20} />}
          title="Delete Account"
          subtitle="Permanently delete your account"
          onPress={onDeleteAccount}
          showArrow={false}
          danger
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

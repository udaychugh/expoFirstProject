import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { User, Shield, Lock, Pause } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SettingItem from './core/settingItem';

import { useAuth } from '@/contexts/AuthContext';
import ApiService from '@/services/api';
import PauseAccountModal from './PauseAccountModal';
import UnpauseAccountModal from './UnpauseAccountModal';
import InfoModal from './InfoModal';

export default function AccountSettings() {
  const router = useRouter();
  const { logout, profile, updateProfile } = useAuth();
  const [pauseModalVisible, setPauseModalVisible] = React.useState(false);
  const [unpauseModalVisible, setUnpauseModalVisible] = React.useState(false);
  const [infoModalVisible, setInfoModalVisible] = React.useState(false);
  const [infoModalConfig, setInfoModalConfig] = React.useState({
    title: '',
    message: '',
    buttonText: 'OK',
    onClose: () => {},
  });
  const [loading, setLoading] = React.useState(false);

  const handlePauseAccount = async (reason: string) => {
    try {
      setLoading(true);
      const response = await ApiService.pauseAccount(reason);
      if (response.success) {
        setPauseModalVisible(false);
        setInfoModalConfig({
          title: 'Account Paused',
          message:
            'Your account is paused and we are logging out. To unpause your account, please login again.',
          buttonText: 'OK, Logout',
          onClose: handlePauseSuccessClose,
        });
        setInfoModalVisible(true);
      } else {
        Alert.alert('Error', response.error || 'Failed to pause account');
      }
    } catch (error) {
      console.error('Pause account error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnpauseAccount = async () => {
    try {
      setLoading(true);
      const response = await ApiService.unpauseAccount();
      if (response.success) {
        updateProfile({
          isPaused: false,
          pausedAt: undefined,
          pauseReason: undefined,
        });
        setUnpauseModalVisible(false);
        setInfoModalConfig({
          title: 'Account Unpaused',
          message:
            'Your account has been successfully unpaused. You are now visible to other users.',
          buttonText: 'Great!',
          onClose: () => setInfoModalVisible(false),
        });
        setInfoModalVisible(true);
      } else {
        Alert.alert('Error', response.error || 'Failed to unpause account');
      }
    } catch (error) {
      console.error('Unpause account error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSuccessClose = async () => {
    setInfoModalVisible(false);
    try {
      await logout();
      router.dismissAll();
      router.replace('/(onboarding)/login');
    } catch (error) {
      console.error('Logout after pause failed:', error);
      // Fallback to login screen anyway
      router.dismissAll();
      router.replace('/(onboarding)/login');
    }
  };

  const isPaused = profile?.pausedAt || profile?.isPaused;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.sectionContent}>
        <SettingItem
          icon={<User color="#6B7280" size={20} />}
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => router.push('/editProfile/edit-profile')}
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
          onPress={() => router.push('./change-password')}
        />
        <SettingItem
          icon={<Pause color="#6B7280" size={20} />}
          title={`${isPaused ? 'Unpause' : 'Pause'} Account`}
          subtitle={`${isPaused ? 'Unpause' : 'Pause'} your account`}
          onPress={() => {
            if (isPaused) {
              setUnpauseModalVisible(true);
            } else {
              setPauseModalVisible(true);
            }
          }}
        />
      </View>

      <PauseAccountModal
        visible={pauseModalVisible}
        onClose={() => setPauseModalVisible(false)}
        onPause={handlePauseAccount}
        loading={loading}
      />

      <UnpauseAccountModal
        visible={unpauseModalVisible}
        onClose={() => setUnpauseModalVisible(false)}
        onUnpause={handleUnpauseAccount}
        loading={loading}
      />

      <InfoModal
        visible={infoModalVisible}
        onClose={infoModalConfig.onClose}
        title={infoModalConfig.title}
        message={infoModalConfig.message}
        buttonText={infoModalConfig.buttonText}
      />
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

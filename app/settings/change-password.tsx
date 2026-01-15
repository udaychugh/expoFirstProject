import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ApiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import InputBox from '@/components/InputBox';
import PrimaryButton from '@/components/PrimaryButton';
import Clickable from '@/components/Clickable';
import Spacer from '@/components/Spacer';
import { validatePassword } from '@/utils/validation';

export default function ChangePassword() {
  const router = useRouter();
  const { logout } = useAuth();

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    // Optional: Add password validation checks here if needed, consistent with register/forgot-password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      Alert.alert('Error', validation.message);
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        'Error',
        'New password cannot be the same as the current password'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ApiService.changePassword(
        isValidCurrentPassword(currentPassword)
          ? currentPassword
          : currentPassword,
        newPassword
      );

      if (result.success) {
        Alert.alert(
          'Success',
          'Password changed successfully. Please login again with your new password.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                router.replace('/(onboarding)/login');
              },
            },
          ]
        );
      } else {
        setError(result.error || 'Failed to change password');
        Alert.alert(
          'Error',
          result.error ||
            'Failed to change password. Please check your current password.'
        );
      }
    } catch (err) {
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkRequirement = (
    text: string,
    type: 'length' | 'upper' | 'lower' | 'number' | 'special'
  ) => {
    switch (type) {
      case 'length':
        return text.length >= 6;
      case 'upper':
        return /[A-Z]/.test(text);
      case 'lower':
        return /[a-z]/.test(text);
      case 'number':
        return /[0-9]/.test(text);
      case 'special':
        return /[^A-Za-z0-9]/.test(text);
      default:
        return false;
    }
  };

  const renderRequirement = (text: string, isMet: boolean) => (
    <View style={styles.requirementItem}>
      {isMet ? (
        <Check color="#16A34A" size={16} />
      ) : (
        <View style={styles.bulletPoint} />
      )}
      <Text
        style={[styles.requirementText, isMet && styles.requirementTextMet]}
      >
        {text}
      </Text>
    </View>
  );

  // Helper to ensure we are passing string (though types say string)
  const isValidCurrentPassword = (pwd: string) => pwd.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Clickable onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </Clickable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Create a new password that is unique and secure.
        </Text>

        <Spacer space={20} />

        <InputBox
          label="Current Password"
          icon={<Lock color="#9CA3AF" size={20} />}
          value={formData.currentPassword}
          onChangeText={(value) => handleInputChange('currentPassword', value)}
          placeholder="Enter current password"
          isPassword
          returnKeyType="next"
          onSubmitEditing={() => newPasswordRef.current?.focus()}
        />

        <Spacer space={16} />

        <InputBox
          label="New Password"
          icon={<Lock color="#9CA3AF" size={20} />}
          value={formData.newPassword}
          onChangeText={(value) => handleInputChange('newPassword', value)}
          placeholder="Enter new password"
          isPassword
          inputRef={newPasswordRef}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />

        <Spacer space={16} />

        <InputBox
          label="Confirm New Password"
          icon={<Lock color="#9CA3AF" size={20} />}
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm new password"
          isPassword
          inputRef={confirmPasswordRef}
          returnKeyType="done"
          onSubmitEditing={handleChangePassword}
        />

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          {renderRequirement(
            'At least 6 characters long',
            checkRequirement(formData.newPassword, 'length')
          )}
          {renderRequirement(
            'At least one uppercase letter',
            checkRequirement(formData.newPassword, 'upper')
          )}
          {renderRequirement(
            'At least one lowercase letter',
            checkRequirement(formData.newPassword, 'lower')
          )}
          {renderRequirement(
            'At least one number',
            checkRequirement(formData.newPassword, 'number')
          )}
          {renderRequirement(
            'At least one special character',
            checkRequirement(formData.newPassword, 'special')
          )}
        </View>

        {error ? (
          <>
            <Spacer space={16} />
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </>
        ) : null}

        <Spacer space={32} />

        <PrimaryButton
          title="Change Password"
          onPress={handleChangePassword}
          isLoading={loading}
          enabled={!loading}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  passwordRequirements: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginLeft: 5,
    marginRight: 1,
  },
  requirementText: {
    fontSize: 14,
    color: '#6B7280',
  },
  requirementTextMet: {
    color: '#16A34A',
    fontWeight: '500',
  },
});

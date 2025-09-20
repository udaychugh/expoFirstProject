import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AuthService from '@/services/auth';
import { validateEmail, validatePassword } from '@/utils/validation';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPassword() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.forgotPassword(formData.email);
      
      if (result.success) {
        Alert.alert(
          'OTP Sent',
          'We have sent a 6-digit OTP to your email address. Please check your inbox.',
          [{ text: 'OK', onPress: () => setCurrentStep('otp') }]
        );
      } else {
        setError(result.error || 'Failed to send OTP');
        Alert.alert('Error', result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (formData.otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.verifyResetOTP(formData.email, formData.otp);
      
      if (result.success) {
        Alert.alert(
          'OTP Verified',
          'OTP verified successfully. Please set your new password.',
          [{ text: 'OK', onPress: () => setCurrentStep('password') }]
        );
      } else {
        setError(result.error || 'Invalid OTP');
        Alert.alert('Error', result.error || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.message);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword
      );
      
      if (result.success) {
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. Please login with your new password.',
          [{ 
            text: 'OK', 
            onPress: () => router.push('/(onboarding)/login')
          }]
        );
      } else {
        setError(result.error || 'Failed to reset password');
        Alert.alert('Error', result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const result = await AuthService.forgotPassword(formData.email);
      
      if (result.success) {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email address.');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Mail color="#E11D48" size={48} />
      </View>
      
      <Text style={styles.stepTitle}>Forgot Password?</Text>
      <Text style={styles.stepSubtitle}>
        Enter your email address and we'll send you an OTP to reset your password
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWithIcon}>
          <Mail color="#9CA3AF" size={20} />
          <TextInput
            style={styles.inputText}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Shield color="#E11D48" size={48} />
      </View>
      
      <Text style={styles.stepTitle}>Enter OTP</Text>
      <Text style={styles.stepSubtitle}>
        We've sent a 6-digit OTP to {formData.email}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>6-Digit OTP</Text>
        <TextInput
          style={styles.otpInput}
          value={formData.otp}
          onChangeText={(value) => handleInputChange('otp', value.replace(/[^0-9]/g, ''))}
          placeholder="000000"
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="#9CA3AF"
          textAlign="center"
        />
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={handleResendOTP}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Lock color="#E11D48" size={48} />
      </View>
      
      <Text style={styles.stepTitle}>Set New Password</Text>
      <Text style={styles.stepSubtitle}>
        Create a strong password for your account
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWithIcon}>
          <Lock color="#9CA3AF" size={20} />
          <TextInput
            style={styles.inputText}
            value={formData.newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            placeholder="Enter new password"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWithIcon}>
          <Lock color="#9CA3AF" size={20} />
          <TextInput
            style={styles.inputText}
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Confirm new password"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.passwordRequirements}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        <Text style={styles.requirementText}>• At least 6 characters long</Text>
        <Text style={styles.requirementText}>• Contains uppercase and lowercase letters</Text>
        <Text style={styles.requirementText}>• Contains at least one number</Text>
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FCE7F3', '#FAE8FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {currentStep === 'email' && renderEmailStep()}
          {currentStep === 'otp' && renderOTPStep()}
          {currentStep === 'password' && renderPasswordStep()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordRequirements: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#E11D48',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E11D48',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
});
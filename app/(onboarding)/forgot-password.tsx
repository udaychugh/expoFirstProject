import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Shield, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AuthService from '@/services/auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import InputBox from '@/components/InputBox';
import PrimaryButton from '@/components/PrimaryButton';
import Spacer from '@/components/Spacer';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPassword() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const confirmPasswordRef = useRef<TextInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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
          [
            {
              text: 'OK',
              onPress: () => {
                setCurrentStep('otp');
                setResendTimer(60);
              },
            },
          ]
        );
      } else {
        setError(result.error || 'Failed to send OTP');
        Alert.alert(
          'Error',
          result.error || 'Failed to send OTP. Please try again.'
        );
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
      const result = await AuthService.verifyResetOTP(
        formData.email,
        formData.otp
      );

      if (result.success) {
        Alert.alert(
          'OTP Verified',
          'OTP verified successfully. Please set your new password.',
          [{ text: 'OK', onPress: () => setCurrentStep('password') }]
        );
      } else {
        setError(result.error || 'Invalid OTP');
        Alert.alert(
          'Error',
          result.error || 'Invalid or expired OTP. Please try again.'
        );
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
          [
            {
              text: 'OK',
              onPress: () => router.push('/(onboarding)/login'),
            },
          ]
        );
      } else {
        setError(result.error || 'Failed to reset password');
        Alert.alert(
          'Error',
          result.error || 'Failed to reset password. Please try again.'
        );
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
        Alert.alert(
          'OTP Resent',
          'A new OTP has been sent to your email address.',
          [{ text: 'OK', onPress: () => setResendTimer(60) }]
        );
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to resend OTP. Please try again.'
        );
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
        Enter your email address and we'll send you an OTP to reset your
        password
      </Text>

      <InputBox
        label="Email Address"
        icon={<Mail color="#9CA3AF" size={20} />}
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Spacer space={20} />

      <PrimaryButton
        title="Send OTP"
        onPress={handleSendOTP}
        isLoading={loading}
        enabled={!loading}
      />
    </View>
  );

  /* eslint-disable react-hooks/rules-of-hooks */
  /* eslint-disable react-hooks/rules-of-hooks */
  const handleOtpChange = (text: string, index: number) => {
    // Clean input to only allow numbers
    const cleanText = text.replace(/[^0-9]/g, '');

    // Handle paste (length > 1) or single input
    if (cleanText.length > 1) {
      const newOtp = formData.otp.split('');

      // Distribute pasted characters
      for (let i = 0; i < cleanText.length && index + i < 6; i++) {
        newOtp[index + i] = cleanText[i];
      }

      handleInputChange('otp', newOtp.join(''));

      // Focus the box after the last filled one, or the last box if all filled
      const nextIndex = Math.min(index + cleanText.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      const newOtp = formData.otp.split('');
      if (text.length > 0) {
        newOtp[index] = text;
        handleInputChange('otp', newOtp.join(''));
        if (index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      } else {
        newOtp[index] = '';
        handleInputChange('otp', newOtp.join(''));
      }
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!formData.otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = formData.otp.split('');
        newOtp[index - 1] = '';
        handleInputChange('otp', newOtp.join(''));
      }
    }
  };

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
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                formData.otp[index] ? styles.otpBoxActive : null,
              ]}
              value={formData.otp[index] || ''}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleOtpKeyPress(e, index)}
              keyboardType="numeric"
              selectTextOnFocus
              textAlign="center"
              placeholderTextColor="#9CA3AF"
            />
          ))}
        </View>
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

      {resendTimer > 0 ? (
        <Text style={styles.timerText}>
          Resend OTP in {resendTimer} seconds
        </Text>
      ) : (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleResendOTP}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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

  const renderPasswordStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Lock color="#E11D48" size={48} />
      </View>

      <Text style={styles.stepTitle}>Set New Password</Text>
      <Text style={styles.stepSubtitle}>
        Create a strong password for your account
      </Text>

      <InputBox
        label="New Password"
        icon={<Lock color="#9CA3AF" size={20} />}
        value={formData.newPassword}
        onChangeText={(value) => handleInputChange('newPassword', value)}
        placeholder="Enter new password"
        isPassword
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <Spacer space={20} />

      <InputBox
        label="Confirm Password"
        icon={<Lock color="#9CA3AF" size={20} />}
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        placeholder="Confirm new password"
        isPassword
        inputRef={confirmPasswordRef}
        returnKeyType="done"
        onSubmitEditing={handleResetPassword}
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

      <PrimaryButton
        title={'Reset Password'}
        onPress={handleResetPassword}
        isLoading={loading}
        enabled={!loading}
      />
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
    alignSelf: 'center',
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
    marginVertical: 24,
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
  timerText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 16,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  otpBoxActive: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
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
  requirementTextMet: {
    color: '#16A34A',
    fontWeight: '500',
  },
});

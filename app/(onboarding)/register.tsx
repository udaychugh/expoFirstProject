import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Phone, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ShowAlert } from '@/components/Alert';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import InputBox from '@/components/InputBox';
import Clickable from '@/components/Clickable';
import Spacer from '@/components/Spacer';

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [error, setError] = useState({
    global: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const getPasswordError = (password: string): string => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('• At least 6 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('• One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('• One lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('• One number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('• One special character');
    }

    return errors.join('\n');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError((prev) => ({
        ...prev,
        [field]: '',
        global: '',
      }));
    }

    if (field === 'password') {
      const passwordError = getPasswordError(value);
      setError((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleRegister = async () => {
    let isError = false;
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all fields',
      });
      setError((prev) => ({ ...prev, global: 'Please fill in all fields' }));
      isError = true;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
      isError = true;
    }

    // Password strength validation
    const passwordError = getPasswordError(formData.password);
    if (passwordError.length > 0) {
      setError((prev) => ({
        ...prev,
        password: passwordError,
      }));
      isError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      isError = true;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError((prev) => ({
        ...prev,
        phone: 'Please enter a valid phone number',
      }));
      isError = true;
    }

    if (isError) return;

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (result.success) {
      ShowAlert({
        type: 'success',
        title: 'Registration Successful',
        message:
          'Your account has been created successfully. Please complete your profile.',
      });
      router.replace('/(onboarding)/profile-setup');
    } else {
      setError((prev) => ({
        ...prev,
        global: result.error || 'Registration failed',
      }));
      ShowAlert({
        type: 'error',
        title: 'Registration Failed',
        message: result.error || 'Please try again',
      });
    }
  };

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FCE7F3', '#FAE8FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Clickable onPress={() => router.back()}>
            <ArrowLeft
              color={isLoading ? '#rgba(31, 41, 55, 0)' : '#1F2937'}
              size={24}
            />
          </Clickable>
          <Text style={styles.title}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Join thousands of people finding their perfect match
          </Text>

          <View style={styles.form}>
            <InputBox
              icon={<User color="#9CA3AF" size={20} />}
              label="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
              enabled={!isLoading}
              error={error.fullName}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <InputBox
              icon={<Mail color="#9CA3AF" size={20} />}
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              enabled={!isLoading}
              error={error.email}
              inputRef={emailRef}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />

            <InputBox
              icon={<Phone color="#9CA3AF" size={20} />}
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              enabled={!isLoading}
              error={error.phone}
              inputRef={phoneRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <InputBox
              icon={<Lock color="#9CA3AF" size={20} />}
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Create a password"
              isPassword={true}
              enabled={!isLoading}
              error={error.password}
              inputRef={passwordRef}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <InputBox
              icon={<Lock color="#9CA3AF" size={20} />}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange('confirmPassword', value)
              }
              placeholder="Confirm your password"
              isPassword={true}
              enabled={!isLoading}
              error={error.confirmPassword}
              inputRef={confirmPasswordRef}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          {error.global ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.global}</Text>
            </View>
          ) : null}

          <PrimaryButton
            title="Continue"
            onPress={handleRegister}
            enabled={!isLoading}
            isLoading={isLoading}
          />

          {__DEV__ && (
            <SecondaryButton
              title="Direct Jump"
              onPress={() => router.replace('/(onboarding)/profile-setup')}
            />
          )}

          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
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
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  inputContainer: {
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
  registerButton: {
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 32,
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

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import OutlineButton from '@/components/OutlineButton';
import ErrorBox from '@/components/ErrorBox';
import InputBox from '@/components/InputBox';
import SecondaryButton from '@/components/SecondaryButton';
import { ShowAlert } from '@/components/Alert';
import Brand from '@/components/Brand';
import Spacer from '@/components/Spacer';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all fields',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Login failed');
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: result.error || 'Please check your credentials and try again',
      });
    }
  };

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Brand
          title={'Welcome Back'}
          message={'Sign in to find your perfect match'}
        />

        <View style={styles.formContainer}>
          <InputBox
            label="Email Address"
            icon={<Mail color={Colors.placeholderGray} size={20} />}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            enabled={!isLoading}
          />

          <Spacer space={20} />

          <InputBox
            label="Password"
            icon={<Lock color={Colors.placeholderGray} size={20} />}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            isPassword={true}
            enabled={!isLoading}
          />

          <View style={{ alignItems: 'flex-end' }}>
            <SecondaryButton
              title="Forget Password?"
              onPress={() => router.push('/(onboarding)/forgot-password')}
            />
          </View>

          {error ? <ErrorBox error={error} /> : null}

          <PrimaryButton
            title={'Sign In'}
            onPress={handleLogin}
            enabled={!isLoading}
            isLoading={isLoading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <OutlineButton
            title="Create New Account"
            onPress={() => router.push('/(onboarding)/register')}
          />
        </View>
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
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholderGray,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.labelGray,
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: Colors.black,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
});

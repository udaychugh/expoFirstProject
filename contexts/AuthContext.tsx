import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthService from '@/services/auth';
import {
  clearAllData,
  getStoreToken,
  getUserInfo,
} from '@/services/db/dataManager';
import { User } from '@/contexts/model/user';
import { AuthContextType } from '@/contexts/model/authContextType';
import { UserProfile } from '@/contexts/model/userProfile';
import ApiService from '@/services/api';
import { useNotification } from '@/hooks/useNotification';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize notification service
  useNotification(!!user);

  const updateProfileInfo = async () => {
    if (profile == null) return;
  };

  const checkAuthStatus = async (): Promise<string> => {
    try {
      setIsLoading(true);
      const tokenData = await getStoreToken();
      const userData = await getUserInfo();

      if (!tokenData?.token || !userData) {
        return '/(onboarding)/welcome';
      } else {
        console.log('User authenticated, waiting for next steps');
        AuthService.setToken(tokenData.token, tokenData.refreshToken);
        const response = await ApiService.getMe();
        if (response.success && response.data) {
          setProfile(response.data.user);
          return '/(tabs)';
        }
        return '/(onboarding)/welcome';
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      return '/(onboarding)/welcome';
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      console.debug('response = %s', JSON.stringify(response));
      if (response.success && response.data) {
        console.log('Login successful, user data:', response.data.user);
        setUser(response.data.user);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || response.message || 'Login failed',
        };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(userData);
      console.debug('response = %s', JSON.stringify(response));
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Registration failed',
        };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      await clearAllData();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (reason: string) => {
    setIsLoading(true);
    try {
      await AuthService.deleteAccount(reason);
      await clearAllData();
      setUser(null);
    } catch (error) {
      console.error('Delete account error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.forgotPassword(email);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.verifyResetOTP(email, otp);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await AuthService.resetPassword(email, otp, newPassword);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...profileData });
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    deleteAccount,
    logout,
    updateUser,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

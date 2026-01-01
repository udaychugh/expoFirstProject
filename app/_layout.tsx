import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/assets/config/toastConfig';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profile-details/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="verification" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
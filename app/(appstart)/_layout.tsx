import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/assets/colors/colors';
import { GlobalStyles } from '@/styles/globalStyle';
import Brand from '@/components/Brand';
import { useRouter } from 'expo-router';
import { getStoreToken, getUserInfo } from '@/services/db/dataManager';

export default function AppStartLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenData = await getStoreToken();
        const userData = await getUserInfo();

        if (!tokenData?.token || !userData) {
          // No token or user data found, navigate to welcome screen
          router.replace('/(onboarding)/welcome');
        } else {
          // User data and token exist
          // TODO: Decide what to do here (e.g., navigate to tabs or verify token)
          console.log('User authenticated, waiting for next steps');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/(onboarding)/welcome');
      }
    };

    // Add a small delay to let the animation play a bit or just run immediately
    // Running immediately for now as per instructions
    checkAuth();
  }, []);

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={[
        GlobalStyles.container,
        {
          justifyContent: 'center',
        },
      ]}
    >
      <Brand isAnimating={true} isLoading={true} />
    </LinearGradient>
  );
}

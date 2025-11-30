import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/assets/colors/colors';
import { GlobalStyles } from '@/styles/globalStyle';
import Brand from '@/components/Brand';
import { useRouter } from 'expo-router';
import { getStoreToken, getUserInfo } from '@/services/db/dataManager';
import { useAuth } from '@/contexts/AuthContext';

export default function AppStartLayout() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const init = async () => {
      const route = await auth.checkAuthStatus();
      if (route) {
        router.replace(route as any);
      } else {
        router.replace('/(onboarding)/welcome');
      }
    };
    init();
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

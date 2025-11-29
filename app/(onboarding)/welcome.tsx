import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, MessageCircle, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { GlobalStyles } from '@/styles/globalStyle';
import Brand from '@/components/Brand';
import Info from './components/info';

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={GlobalStyles.container}
    >
      <Brand />

      <View style={styles.features}>
        <Info
          title="Verified Profiles"
          text="Connect with genuine people looking for marriage"
          icon={<Users color={Colors.pink} size={32} />}
        />

        <Info
          title="Secure Messaging"
          text="Chat safely with your matches"
          icon={<MessageCircle color={Colors.purple} size={32} />}
        />

        <Info
          title="Privacy First"
          text="Your data is secure and private"
          icon={<Shield color={Colors.green} size={32} />}
        />
      </View>

      <View style={styles.buttons}>
        <PrimaryButton
          title="Get Started"
          onPress={() => router.push('/(onboarding)/register')}
        />

        <View style={styles.secondaryButtonContainer}>
          <SecondaryButton
            title="I already have an account"
            onPress={() => router.push('/(onboarding)/login')}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  buttons: {
    gap: 16,
    marginBottom: 32,
  },
  secondaryButtonContainer: {
    alignItems: 'center',
    width: '100%'
  },
});

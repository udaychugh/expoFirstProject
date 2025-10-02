import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, MessageCircle, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={styles.container}>
      <View style={styles.header}>
        <Heart color={Colors.primary} size={48} />
        <Text style={styles.title}>LifeMatch</Text>
        <Text style={styles.subtitle}>Find your perfect life partner</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Users color={Colors.pink} size={32} />
          <Text style={styles.featureTitle}>Verified Profiles</Text>
          <Text style={styles.featureText}>
            Connect with genuine people looking for marriage
          </Text>
        </View>

        <View style={styles.feature}>
          <MessageCircle color={Colors.purple} size={32} />
          <Text style={styles.featureTitle}>Secure Messaging</Text>
          <Text style={styles.featureText}>Chat safely with your matches</Text>
        </View>

        <View style={styles.feature}>
          <Shield color={Colors.green} size={32} />
          <Text style={styles.featureTitle}>Privacy First</Text>
          <Text style={styles.featureText}>
            Your data is secure and private
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <PrimaryButton
          title="Get Started"
          onPress={() => router.push('/(onboarding)/register')}
        />

        <SecondaryButton
          title="I already have an account"
          onPress={() => router.push('/(onboarding)/login')}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#E11D48',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  feature: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  buttons: {
    gap: 16,
    marginBottom: 32,
  },
});

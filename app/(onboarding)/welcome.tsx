import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, MessageCircle, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FCE7F3', '#FAE8FF']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Heart color="#E11D48" size={48} />
        <Text style={styles.title}>LifeMatch</Text>
        <Text style={styles.subtitle}>Find your perfect life partner</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Users color="#EC4899" size={32} />
          <Text style={styles.featureTitle}>Verified Profiles</Text>
          <Text style={styles.featureText}>Connect with genuine people looking for marriage</Text>
        </View>

        <View style={styles.feature}>
          <MessageCircle color="#8B5CF6" size={32} />
          <Text style={styles.featureTitle}>Secure Messaging</Text>
          <Text style={styles.featureText}>Chat safely with your matches</Text>
        </View>

        <View style={styles.feature}>
          <Shield color="#10B981" size={32} />
          <Text style={styles.featureTitle}>Privacy First</Text>
          <Text style={styles.featureText}>Your data is secure and private</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(onboarding)/register')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(onboarding)/login')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
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
  primaryButton: {
    backgroundColor: '#E11D48',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E11D48',
    fontSize: 16,
    fontWeight: '500',
  },
});
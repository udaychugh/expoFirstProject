import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { HelpCircle, Shield, Handshake, Info } from 'lucide-react-native';
import SettingItem from './core/settingItem';
import { URL } from '@/services/model/url';

export default function SupportSettings() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.sectionContent}>
        <SettingItem
          icon={<HelpCircle color="#6B7280" size={20} />}
          title="FAQs"
          subtitle="Read our FAQs"
          onPress={() => Linking.openURL(URL.FAQ)}
        />
        <SettingItem
          icon={<Info color="#6B7280" size={20} />}
          title="Help & Support"
          subtitle="Get help or contact support"
          onPress={() => Linking.openURL(URL.HELP_AND_SUPPORT)}
        />
        <SettingItem
          icon={<Shield color="#6B7280" size={20} />}
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={() => Linking.openURL(URL.PRIVACY_POLICY)}
        />
        <SettingItem
          icon={<Handshake color="#6B7280" size={20} />}
          title="Terms of Service"
          subtitle="Read our terms of service"
          onPress={() => Linking.openURL(URL.TERMS_OF_SERVICE)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

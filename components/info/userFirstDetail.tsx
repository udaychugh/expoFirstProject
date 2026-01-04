import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Moon,
  Phone,
  Mail,
} from 'lucide-react-native';
import Clickable from '../Clickable';

export default function UserFirstDetail({
  phone = undefined,
  email = undefined,
  city,
  state,
  country,
  isNRI,
  occupation,
  education,
  maritalStatus,
  manglik,
}: {
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  isNRI?: boolean;
  occupation?: string;
  education?: string;
  maritalStatus?: string;
  manglik?: boolean;
}) {
  const handlePhonePress = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.infoGrid}>
      {phone && (
        <Clickable style={styles.infoRow} onPress={handlePhonePress}>
          <Phone color="#6B7280" size={16} />
          <Text style={styles.infoText}>{phone}</Text>
        </Clickable>
      )}

      {email && (
        <Clickable style={styles.infoRow} onPress={handleEmailPress}>
          <Mail color="#6B7280" size={16} />
          <Text style={styles.infoText}>{email}</Text>
        </Clickable>
      )}

      <View style={styles.infoRow}>
        <MapPin color="#6B7280" size={16} />
        <Text style={styles.infoText}>
          {city}
          {state ? `, ${state}` : ''}
          {isNRI ? `, ${country}` : ''}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Briefcase color="#6B7280" size={16} />
        <Text style={styles.infoText}>{occupation}</Text>
      </View>

      <View style={styles.infoRow}>
        <GraduationCap color="#6B7280" size={16} />
        <Text style={styles.infoText}>{education}</Text>
      </View>

      <View style={styles.infoRow}>
        <Users color="#6B7280" size={16} />
        <Text style={styles.infoText}>{maritalStatus}</Text>
      </View>

      <View style={styles.infoRow}>
        <Moon color="#6B7280" size={16} />
        <Text style={styles.infoText}>
          {manglik ? 'Manglik' : 'Not Manglik'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

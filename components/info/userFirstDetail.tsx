import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Moon,
} from 'lucide-react-native';

export default function UserFirstDetail({
  city,
  state,
  country,
  isNRI,
  occupation,
  education,
  maritalStatus,
  manglik,
}: {
  city?: string;
  state?: string;
  country?: string;
  isNRI?: boolean;
  occupation?: string;
  education?: string;
  maritalStatus?: string;
  manglik?: boolean;
}) {
  return (
    <View style={styles.infoGrid}>
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

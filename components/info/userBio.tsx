import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UserBio({ bio }: { bio?: string }) {
  return bio ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About Me</Text>
      <Text style={styles.bio}>{bio}</Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserLocationInfo({
  jobLocation,
  permanentLocation,
}: {
  jobLocation?: string;
  permanentLocation?: string;
}) {
  const renderLocationRow = (label: string, value?: string) => {
    return value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ) : null;
  };

  if (!jobLocation && !permanentLocation) return null;

  return (
    <View style={styles.container}>
      {renderLocationRow('Job Location', jobLocation)}
      {renderLocationRow('Permanent Location', permanentLocation)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
});

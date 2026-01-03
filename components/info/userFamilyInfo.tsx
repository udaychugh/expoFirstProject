import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Sibling {
  id: string;
  name: string;
  maritalStatus: string;
}

export default function UserFamilyInfo({
  fatherName,
  fatherOccupation,
  motherName,
  motherOccupation,
  familyIncome,
  siblings,
  createdBy,
}: {
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  familyIncome?: string;
  siblings?: Sibling[];
  createdBy?: string;
}) {
  const renderDetailRow = (label: string, value?: string) => {
    return value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ) : null;
  };

  const hasFamilyInfo =
    fatherName ||
    fatherOccupation ||
    motherName ||
    motherOccupation ||
    familyIncome ||
    (siblings && siblings.length > 0) ||
    createdBy;

  if (!hasFamilyInfo) return null;

  return (
    <View style={styles.container}>
      {renderDetailRow("Father's Name", fatherName)}
      {renderDetailRow("Father's Occupation", fatherOccupation)}
      {renderDetailRow("Mother's Name", motherName)}
      {renderDetailRow("Mother's Occupation", motherOccupation)}
      {renderDetailRow('Family Income', familyIncome)}
      {renderDetailRow('Profile Created By', createdBy)}

      {siblings && siblings.length > 0 && (
        <View style={styles.siblingsSection}>
          <Text style={styles.siblingsTitle}>Siblings</Text>
          {siblings.map((sibling, index) => (
            <View key={index} style={styles.siblingRow}>
              <Text style={styles.siblingName}>{sibling.name}</Text>
              <Text style={styles.siblingOccupation}>{sibling.maritalStatus}</Text>
            </View>
          ))}
        </View>
      )}
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
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  siblingsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  siblingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  siblingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  siblingName: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  siblingOccupation: {
    fontSize: 14,
    color: '#6B7280',
  },
});

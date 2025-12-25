import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserPersonalDetails({
  religion,
  caste,
  height,
  diet,
  smokingHabit,
  drinkingHabit,
  bloodGroup,
  income,
}: {
  religion?: string;
  caste?: string;
  height?: string;
  diet?: string;
  smokingHabit?: string;
  drinkingHabit?: string;
  bloodGroup?: string;
  income?: string;
}) {
  const renderPersonalDetails = ({
    title,
    value,
  }: {
    title: string;
    value?: string;
  }) => {
    return value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{title}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ) : null;
  };

  return (
    <View style={styles.detailsGrid}>
      {renderPersonalDetails({
        title: 'Religion',
        value: religion,
      })}

      {renderPersonalDetails({
        title: 'Caste',
        value: caste,
      })}

      {renderPersonalDetails({
        title: 'Height',
        value: height,
      })}

      {renderPersonalDetails({
        title: 'Diet',
        value: diet,
      })}

      {renderPersonalDetails({
        title: 'Smoking',
        value: smokingHabit,
      })}

      {renderPersonalDetails({
        title: 'Drinking',
        value: drinkingHabit,
      })}

      {renderPersonalDetails({
        title: 'Blood Group',
        value: bloodGroup,
      })}

      {renderPersonalDetails({
        title: 'Annual Salary',
        value: income,
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  detailsGrid: {
    gap: 16,
  },
});

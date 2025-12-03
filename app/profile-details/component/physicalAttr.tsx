import React from 'react';
import RenderSection from './renderSection';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { ProfileData, SelectField } from '@/app/edit-profile';
import ProfileInput from './ProfileInput';

export default function PhysicalAttr({
  profile,
  handleInputChange,
}: {
  profile: any;
  handleInputChange: (key: keyof ProfileData, value: any) => void;
}) {
  return (
    <RenderSection title="Physical Attributes" isExpanded={false}>
      <>
        <ProfileInput
          label="Height"
          placeholder="e.g., 5'6"
          presetValue={profile?.height}
          onChange={(value) => handleInputChange('height', value)}
        />

        <ProfileInput
          label="Weight"
          placeholder="e.g., 65 kg"
          presetValue={profile?.weight}
          onChange={(value) => handleInputChange('weight', value)}
        />

        <SelectField
          label="Blood Group"
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          selectedValue={profile?.bloodGroup}
          onSelectionChange={(value) => handleInputChange('bloodGroup', value)}
        />

        <SelectField
          label="Body Type"
          options={['Slim', 'Athletic', 'Average', 'Chubby']}
          selectedValue={profile?.bodyType}
          onSelectionChange={(value) => handleInputChange('bodyType', value)}
        />

        <SelectField
          label="Complexion"
          options={['Very Fair', 'Fair', 'Wheatish', 'Dark']}
          selectedValue={profile?.complexion}
          onSelectionChange={(value) => handleInputChange('complexion', value)}
        />

        <View style={styles.fieldContainer}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Any Disability</Text>
            <Switch
              value={profile?.hasDisability}
              onValueChange={(value) =>
                handleInputChange('hasDisability', value)
              }
              trackColor={{ false: '#E5E7EB', true: '#FDE2E7' }}
              thumbColor={profile?.hasDisability ? '#E11D48' : '#9CA3AF'}
            />
          </View>
        </View>
      </>
    </RenderSection>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import RenderSection from './core/renderSection';
import ProfileInput from './core/ProfileInput';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X } from 'lucide-react-native';
import { Colors } from '@/assets/colors/colors';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';
import { SelectField } from './core/selectField';

interface Sibling {
  id: string;
  name: string;
  maritalStatus: string;
}

export default function FamilyAndPersonal() {
  const { profile, updateProfile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [fatherName, setFatherName] = useState(
    profile?.familyDetails?.fatherName ?? '',
  );
  const [fatherOccupation, setFatherOccupation] = useState(
    profile?.familyDetails?.fatherOccupation ?? '',
  );
  const [motherName, setMotherName] = useState(
    profile?.familyDetails?.motherName ?? '',
  );
  const [motherOccupation, setMotherOccupation] = useState(
    profile?.familyDetails?.motherOccupation ?? '',
  );
  const [familyIncome, setFamilyIncome] = useState(
    profile?.familyDetails?.familyIncome ?? '',
  );
  const [createdBy, setCreatedBy] = useState(
    profile?.familyDetails?.createdBy ?? '',
  );
  const [siblings, setSiblings] = useState<Sibling[]>(
    profile?.familyDetails?.siblings ?? [],
  );

  const handleInputChange = (field: string, value: string) => {
    setAction('Save');
    switch (field) {
      case 'fatherName':
        setFatherName(value);
        break;
      case 'fatherOccupation':
        setFatherOccupation(value);
        break;
      case 'motherName':
        setMotherName(value);
        break;
      case 'motherOccupation':
        setMotherOccupation(value);
        break;
      case 'familyIncome':
        setFamilyIncome(value);
        break;
      case 'createdBy':
        setCreatedBy(value);
        break;
    }
  };

  const addSibling = () => {
    setAction('Save');
    const newSibling: Sibling = {
      id: Date.now().toString(),
      name: '',
      maritalStatus: '',
    };
    setSiblings([...siblings, newSibling]);
  };

  const removeSibling = (id: string) => {
    setAction('Save');
    setSiblings(siblings.filter((sibling) => sibling.id !== id));
  };

  const updateSiblingName = (id: string, name: string) => {
    setAction('Save');
    setSiblings(
      siblings.map((sibling) =>
        sibling.id === id ? { ...sibling, name } : sibling,
      ),
    );
  };

  const updateSiblingMaritalStatus = (
    id: string,
    status: 'Married' | 'Unmarried',
  ) => {
    setAction('Save');
    setSiblings(
      siblings.map((sibling) =>
        sibling.id === id ? { ...sibling, maritalStatus: status } : sibling,
      ),
    );
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const updateData = {
        fatherName: fatherName,
        motherName: motherName,
        fatherOccupation: fatherOccupation,
        motherOccupation: motherOccupation,
        familyIncome: familyIncome,
        createdBy: createdBy,
        siblings: siblings,
      };
      const response = await ApiService.updateFamilyDetails(updateData);

      if (response.success) {
        setAction('');
        updateProfile({ familyDetails: updateData });
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Family details updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update family details',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RenderSection
      title="Family Details"
      isExpanded={false}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <ProfileInput
          label="Father's Name"
          placeholder="Father's Name"
          presetValue={profile?.familyDetails?.fatherName}
          onChange={(value) => handleInputChange('fatherName', value)}
        />

        <ProfileInput
          label="Father's Occupation"
          placeholder="Father's Occupation"
          presetValue={profile?.familyDetails?.fatherOccupation}
          onChange={(value) => handleInputChange('fatherOccupation', value)}
        />

        <ProfileInput
          label="Mother's Name"
          placeholder="Mother's Name"
          presetValue={profile?.familyDetails?.motherName}
          onChange={(value) => handleInputChange('motherName', value)}
        />

        <ProfileInput
          label="Mother's Occupation"
          placeholder="Mother's Occupation"
          presetValue={profile?.familyDetails?.motherOccupation}
          onChange={(value) => handleInputChange('motherOccupation', value)}
        />

        <ProfileInput
          label="Family Income"
          placeholder="Family Income"
          presetValue={profile?.familyDetails?.familyIncome}
          onChange={(value) => handleInputChange('familyIncome', value)}
        />

        <SelectField
          label="Created By"
          options={[
            { id: 'Father', name: 'Father', image: '' },
            { id: 'Mother', name: 'Mother', image: '' },
            { id: 'Brother', name: 'Brother', image: '' },
            { id: 'Sister', name: 'Sister', image: '' },
            { id: 'Self', name: 'Self', image: '' },
          ]}
          selectedValue={profile?.familyDetails?.createdBy ?? ''}
          onSelectionChange={(value) => handleInputChange('createdBy', value)}
        />

        {/* Siblings Section */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.siblingHeader}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Siblings
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={addSibling}>
              <Plus color="#FFFFFF" size={18} />
              <Text style={styles.addButtonText}>Add Sibling</Text>
            </TouchableOpacity>
          </View>

          {siblings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No siblings added yet. Tap "Add Sibling" to start.
              </Text>
            </View>
          ) : (
            <View style={styles.siblingsContainer}>
              {siblings.map((sibling, index) => (
                <View key={sibling.id} style={styles.siblingCard}>
                  <View style={styles.siblingCardHeader}>
                    <Text style={styles.siblingNumber}>
                      Sibling {index + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeSibling(sibling.id)}
                      style={styles.removeButton}
                    >
                      <X color="#EF4444" size={20} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.siblingInputGroup}>
                    <Text style={styles.siblingLabel}>Name</Text>
                    <TextInput
                      style={styles.siblingInput}
                      value={sibling.name}
                      onChangeText={(text) =>
                        updateSiblingName(sibling.id, text)
                      }
                      placeholder="Enter sibling's name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.siblingInputGroup}>
                    <Text style={styles.siblingLabel}>Marital Status</Text>
                    <View style={styles.maritalStatusContainer}>
                      <TouchableOpacity
                        style={[
                          styles.maritalButton,
                          sibling.maritalStatus === 'Married' &&
                            styles.maritalButtonSelected,
                        ]}
                        onPress={() =>
                          updateSiblingMaritalStatus(sibling.id, 'Married')
                        }
                      >
                        <Text
                          style={[
                            styles.maritalButtonText,
                            sibling.maritalStatus === 'Married' &&
                              styles.maritalButtonTextSelected,
                          ]}
                        >
                          Married
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.maritalButton,
                          sibling.maritalStatus === 'Unmarried' &&
                            styles.maritalButtonSelected,
                        ]}
                        onPress={() =>
                          updateSiblingMaritalStatus(sibling.id, 'Unmarried')
                        }
                      >
                        <Text
                          style={[
                            styles.maritalButtonText,
                            sibling.maritalStatus === 'Unmarried' &&
                              styles.maritalButtonTextSelected,
                          ]}
                        >
                          Unmarried
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </>
    </RenderSection>
  );
}

const styles = StyleSheet.create({
  siblingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  siblingsContainer: {
    gap: 16,
  },
  siblingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  siblingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  siblingNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  removeButton: {
    padding: 4,
  },
  siblingInputGroup: {
    gap: 8,
  },
  siblingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  siblingInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  maritalStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  maritalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  maritalButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  maritalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  maritalButtonTextSelected: {
    color: '#FFFFFF',
  },
});

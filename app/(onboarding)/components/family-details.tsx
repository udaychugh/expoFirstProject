import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import { X, Plus } from 'lucide-react-native';
import InputOutlineBox from '@/components/InputOutlineBox';
import SelectBtns from './selectBtn';
import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

interface Sibling {
  id: string;
  name: string;
  maritalStatus: 'Married' | 'Unmarried' | '';
}

export default function FamilyDetail({
  handleNext,
}: {
  handleNext: () => void;
}) {
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [familyAnnualIncome, setFamilyAnnualIncome] = useState('');
  const [siblings, setSiblings] = useState<Sibling[]>([]);
  const [createdBy, setCreatedBy] = useState('');

  const [isLoading, setLoading] = useState(false);

  const addSibling = () => {
    const newSibling: Sibling = {
      id: Date.now().toString(),
      name: '',
      maritalStatus: '',
    };
    setSiblings([...siblings, newSibling]);
  };

  const removeSibling = (id: string) => {
    setSiblings(siblings.filter((sibling) => sibling.id !== id));
  };

  const updateSiblingName = (id: string, name: string) => {
    setSiblings(
      siblings.map((sibling) =>
        sibling.id === id ? { ...sibling, name } : sibling
      )
    );
  };

  const updateSiblingMaritalStatus = (
    id: string,
    status: 'Married' | 'Unmarried'
  ) => {
    setSiblings(
      siblings.map((sibling) =>
        sibling.id === id ? { ...sibling, maritalStatus: status } : sibling
      )
    );
  };

  const handleSaveButton = async () => {
    try {
      setLoading(true);
      const response = await ApiService.updateFamilyDetails({
        fatherName: fatherName,
        motherName: motherName,
        fatherOccupation: fatherOccupation,
        motherOccupation: motherOccupation,
        familyIncome: familyAnnualIncome,
        siblings: siblings,
        createdBy: createdBy,
      });

      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Profile Updated Successfully',
        });
        handleNext();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Failed to Update Profile',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Failed to Update Profile',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Family Details</Text>
          <Text style={profileStyles.stepSubtitle}>
            Tell us about your family
          </Text>

          <View style={profileStyles.form}>
            {/* Father Name */}
            <InputOutlineBox
              label="Father's Name"
              value={fatherName}
              onChangeText={setFatherName}
              placeholder="Enter father's name"
            />

            {/* Mother Name */}
            <InputOutlineBox
              label="Mother's Name"
              value={motherName}
              onChangeText={setMotherName}
              placeholder="Enter mother's name"
            />

            {/* Father Occupation */}
            <InputOutlineBox
              label="Father's Occupation"
              value={fatherOccupation}
              onChangeText={setFatherOccupation}
              placeholder="Enter father's occupation"
            />

            {/* Mother Occupation */}
            <InputOutlineBox
              label="Mother's Occupation"
              value={motherOccupation}
              onChangeText={setMotherOccupation}
              placeholder="Enter mother's occupation"
            />

            {/* Family Annual Income */}
            <InputOutlineBox
              label="Family Annual Income"
              value={familyAnnualIncome}
              onChangeText={setFamilyAnnualIncome}
              placeholder="Enter family annual income"
            />

            {/* Siblings Section */}
            <View style={profileStyles.inputGroup}>
              <View style={styles.siblingHeader}>
                <Text style={profileStyles.label}>Siblings</Text>
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
                              updateSiblingMaritalStatus(
                                sibling.id,
                                'Unmarried'
                              )
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

            {/* Created By */}
            <SelectBtns
              title="Created By"
              list={['Father', 'Mother', 'Brother', 'Sister', 'Self']}
              onPress={setCreatedBy}
            />
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={'Save Info'}
        enabled={!isLoading}
        isLoading={isLoading}
        onPress={handleSaveButton}
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Colors } from '@/assets/colors/colors';
import { useAuth } from '@/contexts/AuthContext';
import ApiService from '@/services/api';
import PrimaryButton from '@/components/PrimaryButton';
import { ShowAlert } from '@/components/Alert';
import { RELIGIONS } from '@/app/(onboarding)/models/religions';
import SelectionPicker from '@/components/SelectionPicker';
import { HEIGHTS, MARITAL_STATUS } from '../(onboarding)/models/height';

const EDUCATION_LEVELS = [
  'High School',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Diploma',
  'Other',
];

const OCCUPATIONS = [
  'Software Engineer',
  'Doctor',
  'Teacher',
  'Business',
  'Engineer',
  'Lawyer',
  'Artist',
  'Other',
];

export default function MatchPreferences() {
  const router = useRouter();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // State for preferences
  const [ageRange, setAgeRange] = useState({ min: 18, max: 35 });
  const [heightRange, setHeightRange] = useState({
    min: '4\'0"',
    max: '7\'0"',
  });
  const [maxDistance, setMaxDistance] = useState(50);

  // Picker States
  const [minHeightPickerVisible, setMinHeightPickerVisible] = useState(false);
  const [maxHeightPickerVisible, setMaxHeightPickerVisible] = useState(false);

  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([]);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string[]>(
    [],
  );

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    religion: false,
    education: false,
    occupation: false,
    maritalStatus: true,
  });

  useEffect(() => {
    if (profile && profile.preferences) {
      setAgeRange(profile.preferences.ageRange || { min: 18, max: 35 });
      setHeightRange(
        profile.preferences.heightRange || { min: '4\'0"', max: '7\'0"' },
      );
      setMaxDistance(profile.preferences.maxDistance || 50);
      setSelectedReligions(profile.preferences.religion || []);
      setSelectedEducation(profile.preferences.education || []);
      setSelectedOccupations(profile.preferences.occupation || []);
      setSelectedMaritalStatus(profile.preferences.maritalStatus || []);
    }
  }, [profile]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedPreferences = {
        ageRange,
        heightRange,
        maxDistance,
        religion: selectedReligions,
        education: selectedEducation,
        occupation: selectedOccupations,
        maritalStatus: selectedMaritalStatus,
        location: profile?.preferences?.location || [], // Preserve generic location if any
      };

      const response =
        await ApiService.updateUserPreferences(updatedPreferences);

      if (response.success) {
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Preferences updated successfully',
        });
        // checkUser(); // Refresh local profile
        router.back();
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update',
        });
      }
    } catch (error) {
      console.error(error);
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({
    title,
    expanded,
    onPress,
  }: {
    title: string;
    expanded: boolean;
    onPress: () => void;
  }) => (
    <Pressable style={styles.sectionHeader} onPress={onPress}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {expanded ? (
        <ChevronUp size={20} color="#6B7280" />
      ) : (
        <ChevronDown size={20} color="#6B7280" />
      )}
    </Pressable>
  );

  const MultiSelectChips = ({
    items,
    selected,
    onToggle,
  }: {
    items: string[];
    selected: string[];
    onToggle: (item: string) => void;
  }) => (
    <View style={styles.chipContainer}>
      {items.map((item) => (
        <Pressable
          key={item}
          style={[styles.chip, selected.includes(item) && styles.chipSelected]}
          onPress={() => onToggle(item)}
        >
          <Text
            style={[
              styles.chipText,
              selected.includes(item) && styles.chipTextSelected,
            ]}
          >
            {item}
          </Text>
          {selected.includes(item) && (
            <Check size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
          )}
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#1F2937" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Match Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Set your preferences to help us find the perfect match for you.
        </Text>

        {/* Age Range */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Age Range</Text>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeValue}>{ageRange.min} years</Text>
            <Text style={styles.rangeValue}>{ageRange.max} years</Text>
          </View>

          <Text style={styles.sliderLabel}>Minimum Age</Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={65}
            step={1}
            value={ageRange.min}
            onValueChange={(val) =>
              setAgeRange((prev) => ({ ...prev, min: val }))
            }
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor={Colors.primary}
          />

          <Text style={styles.sliderLabel}>Maximum Age</Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={65}
            step={1}
            value={ageRange.max}
            onValueChange={(val) =>
              setAgeRange((prev) => ({ ...prev, max: val }))
            }
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor={Colors.primary}
          />
        </View>

        {/* Max Distance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maximum Distance</Text>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeValue}>{maxDistance} km</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={500}
            step={10}
            value={maxDistance}
            onValueChange={setMaxDistance}
            minimumTrackTintColor={Colors.primary}
            thumbTintColor={Colors.primary}
          />
        </View>

        {/* Height Range */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Height Preference</Text>
          <View style={styles.heightRow}>
            <Pressable
              style={styles.heightInput}
              onPress={() => setMinHeightPickerVisible(true)}
            >
              <Text style={styles.inputLabel}>Min Height</Text>
              <Text style={styles.heightValue}>{heightRange.min}</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ marginTop: 4 }} />
            </Pressable>

            <Pressable
              style={styles.heightInput}
              onPress={() => setMaxHeightPickerVisible(true)}
            >
              <Text style={styles.inputLabel}>Max Height</Text>
              <Text style={styles.heightValue}>{heightRange.max}</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ marginTop: 4 }} />
            </Pressable>
          </View>

          <SelectionPicker
            visible={minHeightPickerVisible}
            title="Select Minimum Height"
            options={HEIGHTS}
            selected={heightRange.min}
            onSelect={(val) =>
              setHeightRange((prev) => ({ ...prev, min: val }))
            }
            onClose={() => setMinHeightPickerVisible(false)}
          />

          <SelectionPicker
            visible={maxHeightPickerVisible}
            title="Select Maximum Height"
            options={HEIGHTS}
            selected={heightRange.max}
            onSelect={(val) =>
              setHeightRange((prev) => ({ ...prev, max: val }))
            }
            onClose={() => setMaxHeightPickerVisible(false)}
          />
        </View>

        {/* Marital Status */}
        <View style={styles.card}>
          <SectionHeader
            title="Marital Status"
            expanded={expandedSections.maritalStatus}
            onPress={() => toggleSection('maritalStatus')}
          />
          {expandedSections.maritalStatus && (
            <MultiSelectChips
              items={MARITAL_STATUS}
              selected={selectedMaritalStatus}
              onToggle={(item) =>
                toggleSelection(
                  selectedMaritalStatus,
                  setSelectedMaritalStatus,
                  item,
                )
              }
            />
          )}
        </View>

        {/* Religion */}
        <View style={styles.card}>
          <SectionHeader
            title="Religion"
            expanded={expandedSections.religion}
            onPress={() => toggleSection('religion')}
          />
          {expandedSections.religion && (
            <MultiSelectChips
              items={RELIGIONS.map((r) => r.name)}
              selected={selectedReligions}
              onToggle={(item) =>
                toggleSelection(selectedReligions, setSelectedReligions, item)
              }
            />
          )}
        </View>

        {/* Education */}
        <View style={styles.card}>
          <SectionHeader
            title="Education"
            expanded={expandedSections.education}
            onPress={() => toggleSection('education')}
          />
          {expandedSections.education && (
            <MultiSelectChips
              items={EDUCATION_LEVELS}
              selected={selectedEducation}
              onToggle={(item) =>
                toggleSelection(selectedEducation, setSelectedEducation, item)
              }
            />
          )}
        </View>

        {/* Occupation */}
        <View style={styles.card}>
          <SectionHeader
            title="Occupation"
            expanded={expandedSections.occupation}
            onPress={() => toggleSection('occupation')}
          />
          {expandedSections.occupation && (
            <MultiSelectChips
              items={OCCUPATIONS}
              selected={selectedOccupations}
              onToggle={(item) =>
                toggleSelection(
                  selectedOccupations,
                  setSelectedOccupations,
                  item,
                )
              }
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={'Save Preferences'}
          onPress={handleSave}
          isLoading={saving}
          enabled={!saving}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rangeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  heightRow: {
    flexDirection: 'row',
    gap: 16,
  },
  heightInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  heightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  helperText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

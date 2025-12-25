import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const { height } = Dimensions.get('window');

export interface FilterOptions {
  ageMin?: number;
  ageMax?: number;
  location?: string;
  religion?: string;
  education?: string;
  occupation?: string;
  maritalStatus?: string;
  manglik?: string;
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FILTER_CATEGORIES = [
  { id: 'age', label: 'Age Range', icon: '🎂' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'religion', label: 'Religion', icon: '🕉️' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'occupation', label: 'Occupation', icon: '💼' },
  { id: 'maritalStatus', label: 'Marital Status', icon: '💍' },
  { id: 'manglik', label: 'Manglik', icon: '✨' },
];

const LOCATIONS = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1551161242-b5af797b7233?w=400',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400',
  },
  {
    id: 'pune',
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1608408843596-b3119736057c?w=400',
  },
];

const RELIGIONS = [
  { id: 'hindu', name: 'Hindu' },
  { id: 'christian', name: 'Christian' },
  { id: 'sikh', name: 'Sikh' },
  { id: 'buddhist', name: 'Buddhist' },
  { id: 'jain', name: 'Jain' },
  { id: 'other', name: 'Other' },
];

const EDUCATION_LEVELS = [
  { id: 'high-school', name: 'High School' },
  { id: 'bachelors', name: "Bachelor's Degree" },
  { id: 'masters', name: "Master's Degree" },
  { id: 'phd', name: 'PhD' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'other', name: 'Other' },
];

const OCCUPATIONS = [
  { id: 'software-engineer', name: 'Software Engineer' },
  { id: 'doctor', name: 'Doctor' },
  { id: 'teacher', name: 'Teacher' },
  { id: 'business', name: 'Business' },
  { id: 'engineer', name: 'Engineer' },
  { id: 'lawyer', name: 'Lawyer' },
  { id: 'artist', name: 'Artist' },
  { id: 'other', name: 'Other' },
];

const MARITAL_STATUS = [
  { id: 'never-married', name: 'Never Married' },
  { id: 'divorced', name: 'Divorced' },
  { id: 'widowed', name: 'Widowed' },
  { id: 'separated', name: 'Separated' },
];

const MANGLIK_STATUS = [
  { id: 'manglik', name: 'Manglik' },
  { id: 'non-manglik', name: 'Non-Manglik' },
];

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: FilterBottomSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState('age');
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [ageMin, setAgeMin] = useState(initialFilters.ageMin || 18);
  const [ageMax, setAgeMax] = useState(initialFilters.ageMax || 50);

  const handleApply = () => {
    const appliedFilters: FilterOptions = {
      ...filters,
      ageMin,
      ageMax,
    };
    onApply(appliedFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    setAgeMin(18);
    setAgeMax(50);
  };

  const renderRightContent = () => {
    switch (selectedCategory) {
      case 'age':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Age Range</Text>
            <View style={styles.ageContainer}>
              <View style={styles.ageLabels}>
                <Text style={styles.ageLabel}>Min: {ageMin}</Text>
                <Text style={styles.ageLabel}>Max: {ageMax}</Text>
              </View>

              <Text style={styles.sliderLabel}>Minimum Age</Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={50}
                step={1}
                value={ageMin}
                onValueChange={setAgeMin}
                minimumTrackTintColor="#E11D48"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#E11D48"
              />

              <Text style={styles.sliderLabel}>Maximum Age</Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={50}
                step={1}
                value={ageMax}
                onValueChange={setAgeMax}
                minimumTrackTintColor="#E11D48"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#E11D48"
              />
            </View>
          </View>
        );

      case 'location':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Location</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.locationGrid}
            >
              {LOCATIONS.map((loc) => (
                <Pressable
                  key={loc.id}
                  style={({ pressed }) => [
                    styles.locationCard,
                    filters.location === loc.name && styles.locationCardActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() => setFilters({ ...filters, location: loc.name })}
                >
                  <Image
                    source={{ uri: loc.image }}
                    style={styles.locationImage}
                  />
                  <View style={styles.locationOverlay}>
                    <Text style={styles.locationName}>{loc.name}</Text>
                    {filters.location === loc.name && (
                      <View style={styles.checkmark}>
                        <Check color="#FFFFFF" size={16} />
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 'religion':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Religion</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {RELIGIONS.map((religion) => (
                <Pressable
                  key={religion.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    filters.religion === religion.name &&
                      styles.optionItemActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, religion: religion.name })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.religion === religion.name &&
                        styles.optionTextActive,
                    ]}
                  >
                    {religion.name}
                  </Text>
                  {filters.religion === religion.name && (
                    <Check color="#E11D48" size={20} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 'education':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Education</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {EDUCATION_LEVELS.map((edu) => (
                <Pressable
                  key={edu.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    filters.education === edu.name && styles.optionItemActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, education: edu.name })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.education === edu.name && styles.optionTextActive,
                    ]}
                  >
                    {edu.name}
                  </Text>
                  {filters.education === edu.name && (
                    <Check color="#E11D48" size={20} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 'occupation':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Occupation</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {OCCUPATIONS.map((occ) => (
                <Pressable
                  key={occ.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    filters.occupation === occ.name && styles.optionItemActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, occupation: occ.name })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.occupation === occ.name &&
                        styles.optionTextActive,
                    ]}
                  >
                    {occ.name}
                  </Text>
                  {filters.occupation === occ.name && (
                    <Check color="#E11D48" size={20} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 'maritalStatus':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Marital Status</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MARITAL_STATUS.map((status) => (
                <Pressable
                  key={status.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    filters.maritalStatus === status.name &&
                      styles.optionItemActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, maritalStatus: status.name })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.maritalStatus === status.name &&
                        styles.optionTextActive,
                    ]}
                  >
                    {status.name}
                  </Text>
                  {filters.maritalStatus === status.name && (
                    <Check color="#E11D48" size={20} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );
      case 'manglik':
        return (
          <View style={styles.rightContent}>
            <Text style={styles.rightTitle}>Select Manglik Status</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MANGLIK_STATUS.map((status) => (
                <Pressable
                  key={status.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    filters.manglik === status.name && styles.optionItemActive,
                    pressed && styles.pressedEffect,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, manglik: status.name })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.manglik === status.name &&
                        styles.optionTextActive,
                    ]}
                  >
                    {status.name}
                  </Text>
                  {filters.manglik === status.name && (
                    <Check color="#E11D48" size={20} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.bottomSheet}>
          <SafeAreaView edges={['bottom']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Apply Filters</Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressedEffect,
                ]}
              >
                <X color="#6B7280" size={24} />
              </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Left Sidebar */}
              <View style={styles.sidebar}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {FILTER_CATEGORIES.map((category) => (
                    <Pressable
                      key={category.id}
                      style={({ pressed }) => [
                        styles.categoryItem,
                        selectedCategory === category.id &&
                          styles.categoryItemActive,
                        pressed && styles.pressedEffect,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text
                        style={[
                          styles.categoryLabel,
                          selectedCategory === category.id &&
                            styles.categoryLabelActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Right Content */}
              {renderRightContent()}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [
                  styles.resetButton,
                  pressed && styles.pressedEffect,
                ]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset All</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.applyButton,
                  pressed && styles.pressedEffect,
                ]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 140,
    backgroundColor: '#F9FAFB',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  categoryItemActive: {
    backgroundColor: '#FEE2E2',
    borderRightWidth: 3,
    borderRightColor: '#E11D48',
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#E11D48',
    fontWeight: '700',
  },
  rightContent: {
    flex: 1,
    padding: 20,
  },
  rightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  ageContainer: {
    gap: 16,
  },
  ageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E11D48',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  locationCard: {
    width: '47%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locationCardActive: {
    borderColor: '#E11D48',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    alignItems: 'center',
  },
  locationName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: -28,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  optionItemActive: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#E11D48',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#E11D48',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E11D48',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pressedEffect: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});

import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

export const SelectField = ({
  label,
  options,
  selectedValue,
  onSelectionChange,
}: {
  label: string;
  options: { id: string; name: string; image: string }[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selectHeader,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Text style={[styles.selectText, !selectedValue && styles.placeholder]}>
          {selectedValue || 'Select option'}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </Pressable>

      {isExpanded && (
        <View style={styles.selectOptions}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.selectOption,
                selectedValue === option.name && styles.selectedOption,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                onSelectionChange(option.name);
                setIsExpanded(false);
              }}
              android_ripple={{ color: 'rgba(225, 29, 72, 0.1)' }}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  selectedValue === option.name && styles.selectedOptionText,
                ]}
              >
                {option.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

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
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  selectOptions: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#FEF2F2',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#E11D48',
    fontWeight: '500',
  },
});

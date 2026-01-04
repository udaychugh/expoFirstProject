import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet
} from 'react-native';
import { ChevronDown } from 'lucide-react-native'; // Only import ChevronDown, we'll rotate it
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

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
  const expandProgress = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (name: string) => {
    onSelectionChange(name);
    setIsExpanded(false);
  };

  // Estimate height: roughly 50px per item
  const estimatedHeight = options.length * 50;

  const dropdownStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandProgress.value,
      [0, 1],
      [0, estimatedHeight],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      expandProgress.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      expandProgress.value,
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selectHeader,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={toggleExpand}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Text style={[styles.selectText, !selectedValue && styles.placeholder]}>
          {selectedValue || 'Select option'}
        </Text>
        <Animated.View style={iconStyle}>
          <ChevronDown size={20} color="#6B7280" />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.selectOptionsContainer, dropdownStyle]}>
        <View style={styles.selectOptionsContent}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.selectOption,
                selectedValue === option.name && styles.selectedOption,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={() => handleSelect(option.name)}
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
      </Animated.View>
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
    zIndex: 1, // Keep header above
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  selectOptionsContainer: {
    // Container for the animated height
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    // Borders will be tricky with height 0, maybe handle in content or inner view
  },
  selectOptionsContent: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FFFFFF',
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

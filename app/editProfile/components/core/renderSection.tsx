import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native'; // Only import ChevronDown here too
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface RenderSectionProps {
  title: string;
  children: React.ReactNode;
  action?: string;
  loading?: boolean;
  isExpanded: boolean;
  onActionClick?: () => void;
}

export default function RenderSection({
  title,
  children,
  action,
  loading,
  isExpanded,
  onActionClick,
}: RenderSectionProps) {
  const [toggle, setToggle] = useState(isExpanded);
  const expandProgress = useSharedValue(0);
  const listHeight = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(toggle ? 1 : 0, { duration: 300 });
  }, [toggle]);

  const bodyStyle = useAnimatedStyle(() => {
    return {
      height: listHeight.value * expandProgress.value,
      overflow: 'hidden',
      width: '100%',
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
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [
          styles.sectionHeader,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => setToggle(!toggle)}
        android_ripple={{ color: 'rgba(225, 29, 72, 0.1)' }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#E11D48" />
        ) : action ? (
          <Pressable onPress={onActionClick}>
            <Text style={{ color: '#E11D48', fontWeight: 'bold' }}>
              {action}
            </Text>
          </Pressable>
        ) : (
          <Animated.View style={iconStyle}>
            <ChevronDown size={24} color="#E11D48" />
          </Animated.View>
        )}
      </Pressable>
      <Animated.View style={bodyStyle}>
        <View
          collapsable={false}
          style={[
            styles.sectionContent,
            { width: '100%', position: 'absolute' },
          ]}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (height > 0) {
              listHeight.value = height;
            }
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    padding: 16,
  },
});

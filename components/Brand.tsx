import React, { useEffect } from 'react';
import { Heart } from 'lucide-react-native';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/assets/colors/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

export default function Brand({
  title = "LifeMatch",
  message = "Find your perfect life partner",
  isAnimating = false,
  isLoading = false
}: {
  title?: string;
  message?: string;
  isAnimating?: boolean;
  isLoading?: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isAnimating) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 150, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.2, { duration: 150, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 400 }) // pause between beats
        ),
        -1, // infinite repeat
        false // do not reverse
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1);
    }
  }, [isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.header}>
      <Animated.View style={animatedStyle}>
        <Heart
          color={Colors.primary}
          size={48}
          fill={isAnimating ? Colors.primary : 'transparent'}
        />
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
      {!isLoading && (
        <Text style={styles.subtitle}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#E11D48',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

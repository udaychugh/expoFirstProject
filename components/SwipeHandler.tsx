import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Heart, X, Star } from 'lucide-react-native';

export default function SwipeHandler({
  handlePass,
  handleShortlist,
  handleLike,
}: {
  handlePass: () => void;
  handleShortlist: () => void;
  handleLike: () => void;
}) {
  return (
    <View style={styles.actions}>
      <Pressable
        style={({ pressed }) => [
          styles.baseButton,
          styles.passButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePass}
      >
        {({ pressed }) => (
          <>
            <X color="#EF4444" size={24} />
            <Text style={styles.actionLabel}>Not Interested</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.baseButton,
          styles.shortlistButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleShortlist}
      >
        {({ pressed }) => (
          <>
            <Star
              color="#F59E0B"
              size={24}
              fill={pressed ? '#F59E0B' : 'none'}
            />
            <Text style={styles.actionLabel}>Shortlist</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.baseButton,
          styles.likeButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLike}
      >
        {({ pressed }) => (
          <>
            <Heart
              color="#E11D48"
              size={24}
              fill={pressed ? '#E11D48' : 'none'}
            />
            <Text style={styles.actionLabel}>Interested</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  baseButton: {
    flex: 1,
    padding: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  passButton: {
    shadowColor: '#EF4444',
    borderColor: '#FEE2E2',
  },
  shortlistButton: {
    shadowColor: '#F59E0B',
    borderColor: '#FEF3C7',
  },
  likeButton: {
    shadowColor: '#E11D48',
    borderColor: '#FEE2E2',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#6B7280',
    marginTop: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Clickable from '../Clickable';

export default function RequestToProcess({
    title,
    description,
    buttonTitle,
    route,
}: {
    title: string;
    description: string;
    buttonTitle: string;
    route: string;
}) {
    return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { marginBottom: 8, fontSize: 20 }]}>
            {title}
          </Text>
          <Text style={[styles.emptyText, { fontSize: 14, marginBottom: 24 }]}>
            {description}
          </Text>
          <Clickable
            style={styles.retryButton}
            onPress={() => router.push(route as any)}
          >
            <Text style={styles.retryButtonText}>{buttonTitle}</Text>
          </Clickable>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

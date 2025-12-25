import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppImage from './AppImage';

interface InterestItem {
  id: string;
  name: string;
  image: string;
}

interface InterestsSectionProps {
  title: string;
  items: string[];
  dataSource: InterestItem[];
}

export default function InterestsSection({
  title,
  items,
  dataSource,
}: InterestsSectionProps) {
  // If no items, don't render the section
  if (!items || items.length === 0) {
    return null;
  }

  // Filter dataSource to only show items that are in the items array
  const filteredItems = dataSource.filter((item) => items.includes(item.name));

  // If no matching items found, don't render
  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.interestCard}>
            <AppImage
              src={item.image}
              style={styles.interestImage}
              disableFullScreen={true}
            />
            <View style={styles.interestOverlay}>
              <Text style={styles.interestText} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 0,
    gap: 12,
  },
  interestCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  interestImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  interestOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

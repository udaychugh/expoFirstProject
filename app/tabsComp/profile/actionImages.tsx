import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppImage from '@/components/AppImage';

export default function ActionImages({
  imageOne,
  imageTwo,
}: {
  imageOne?: string;
  imageTwo?: string;
}) {
  return (
    <View style={styles.imagesContainer}>
      <View style={styles.mainImageContainer}>
        <AppImage src={imageOne} style={styles.mainImage} />
      </View>

      {imageTwo && (
        <View style={styles.secondaryImageContainer}>
          <AppImage src={imageTwo} style={styles.secondaryImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  mainImageContainer: {
    flex: 2,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  secondaryImageContainer: {
    flex: 1,
  },
  secondaryImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
});

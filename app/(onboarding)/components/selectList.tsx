import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { profileStyles } from './styles';
import { Image } from 'expo-image';
import { Check, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/assets/colors/colors';

export default function SelectList({
  title,
  listData,
  setItemData,
}: {
  title: string;
  listData: {
    id: string;
    name: string;
    image: string;
  }[];
  setItemData: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [value, setValue] = useState<string[]>([]);

  // Toggle selection for arrays
  const toggleSelection = (
    item: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedArray.includes(item)) {
      setItemData(selectedArray.filter((i) => i !== item));
      setSelectedArray(selectedArray.filter((i) => i !== item));
    } else {
      setItemData([...selectedArray, item]);
      setSelectedArray([...selectedArray, item]);
    }
  };

  return (
    <View style={profileStyles.inputGroup}>
      <Text style={profileStyles.label}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => {
          const isSelected = value.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.imageCard, isSelected && styles.selectedImageCard]}
              onPress={() => toggleSelection(item.id, value, setValue)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                {isSelected && (
                  <View style={styles.checkmarkOverlay}>
                    <View style={styles.checkmarkCircle}>
                      <Check color="#FFFFFF" size={16} />
                    </View>
                  </View>
                )}
              </View>
              <Text
                style={[styles.cardText, isSelected && styles.selectedCardText]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    paddingVertical: 8,
    gap: 12,
  },
  imageCard: {
    width: 120,
    marginRight: 12,
  },
  selectedImageCard: {
    transform: [{ scale: 0.95 }],
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(225, 29, 72, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedCardText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

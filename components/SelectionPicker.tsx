import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Colors } from '@/assets/colors/colors';

interface SelectionPickerProps {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function SelectionPicker({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: SelectionPickerProps) {
  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selected;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          isSelected && styles.itemSelected,
          pressed && styles.pressedEffect,
        ]}
        onPress={() => {
          onSelect(item);
          onClose(); // Auto close on select
        }}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item}
        </Text>
        {isSelected && <Check size={20} color={Colors.primary} />}
      </Pressable>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* List */}
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.5, // Half screen height
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  itemSelected: {
    backgroundColor: '#FDF2F4', // Light pink bg
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  itemTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  pressedEffect: {
    opacity: 0.7,
  },
});

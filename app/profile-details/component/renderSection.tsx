import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface RenderSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
}

export default function RenderSection({
  title,
  children,
  isExpanded,
}: RenderSectionProps) {
  const [toggle, setToggle] = useState(isExpanded);

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
        {toggle ? (
          <ChevronUp size={24} color="#E11D48" />
        ) : (
          <ChevronDown size={24} color="#E11D48" />
        )}
      </Pressable>
      {toggle && <View style={styles.sectionContent}>{children}</View>}
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

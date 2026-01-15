import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
} from 'react-native';

import { ChevronRight } from 'lucide-react-native';
import Clickable from '@/components/Clickable';

export default function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  showToggle = false,
  toggleValue = false,
  onToggle,
  showArrow = true,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}) {
  return (
    <Clickable
      style={styles.settingItem}
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.settingLeft}>
        <View
          style={[styles.iconContainer, danger && styles.dangerIconContainer]}
        >
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {showToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
            thumbColor={toggleValue ? '#E11D48' : '#FFFFFF'}
          />
        ) : showArrow ? (
          <ChevronRight color="#9CA3AF" size={20} />
        ) : null}
      </View>
    </Clickable>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dangerIconContainer: {
    backgroundColor: '#FEF2F2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  dangerText: {
    color: '#EF4444',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

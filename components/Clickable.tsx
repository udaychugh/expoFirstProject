import React from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';

interface ClickableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * A reusable wrapper component that makes any child clickable
 * with a consistent active opacity of 0.8.
 */
export default function Clickable({
  children,
  style,
  onPress,
  activeOpacity = 0.8,
  ...props
}: ClickableProps) {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={style}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

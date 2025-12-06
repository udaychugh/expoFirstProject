import { Colors } from '@/assets/colors/colors';
import Toast from 'react-native-toast-message';

export function ShowAlert({
  type,
  title,
  message = '',
  position = 'top',
}: {
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  position?: 'top' | 'bottom';
}) {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    position: position,
    swipeable: false,
  });
}

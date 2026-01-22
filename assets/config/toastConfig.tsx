import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors } from '../colors/colors';

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.success }}
      text1Style={{
        fontSize: 14,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 12,
        fontWeight: 'normal',
        color: Colors.black,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.primary }}
      text1Style={{
        fontSize: 14,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 12,
        fontWeight: 'normal',
        color: Colors.black,
      }}
    />
  ),
};

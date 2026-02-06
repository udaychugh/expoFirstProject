import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import ApiService from '@/services/api';
import * as Notifications from 'expo-notifications';

// Configure how notifications should be handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotification = (isAuthenticated: boolean) => {
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        return true;
      }
    } catch (error) {
      console.error('Permission request failed', error);
    }
    return false;
  };

  const getFCMToken = async () => {
    try {
      // Register device for remote messages (iOS mostly, but good to check)
      if (
        Platform.OS === 'ios' &&
        !messaging().isDeviceRegisteredForRemoteMessages
      ) {
        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        await ApiService.updateFcmToken(token);
      } else {
        console.log('FCM Token not found');
      }
    } catch (error) {
      console.error('Get FCM token failed', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      requestUserPermission().then((granted) => {
        if (granted) {
          getFCMToken();
        }
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (token) => {
        if (isAuthenticated) {
          console.log('FCM Token Refreshed:', token);
          await ApiService.updateFcmToken(token);
        }
      },
    );

    return unsubscribeTokenRefresh;
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );

        const { notification } = remoteMessage;
        if (notification) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.title || 'New Notification',
              body: notification.body || '',
              data: remoteMessage.data,
            },
            trigger: null,
          });
        }
      },
    );

    return unsubscribeOnMessage;
  }, []);
};

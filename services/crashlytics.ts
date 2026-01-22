import crashlytics from '@react-native-firebase/crashlytics';

export const logCrashlyticsError = (error: Error, context?: string) => {
  if (context) {
    crashlytics().log(context);
  }
  crashlytics().recordError(error);
};

export const setCrashlyticsUserId = (id: string) => {
  crashlytics().setUserId(id);
};

export const crashTest = () => {
  crashlytics().crash();
};

export default crashlytics();

const APIConstants = {
  BASE_URL: __DEV__
    ? 'http://192.168.1.7:5000/api'
    : 'http://13.204.55.83:5000/api',
    // : 'https://life-match-cloud.onrender.com/api',
  VERSION: 'v1',
} as const;

export const API_BASE_URL = `${APIConstants.BASE_URL}/${APIConstants.VERSION}`;

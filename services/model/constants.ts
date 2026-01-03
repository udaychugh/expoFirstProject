const APIConstants = {
  BASE_URL: __DEV__
    ? 'http://192.168.1.6:5000/api'
    : 'https://life-match-cloud.onrender.com/api',
  VERSION: 'v1',
} as const;

export const API_BASE_URL = `${APIConstants.BASE_URL}/${APIConstants.VERSION}`;

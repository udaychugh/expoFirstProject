import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../model/postauth/userProfile';
import { DBKeys } from './model/keys';

export const storeUserInfo = async (info: UserProfile) => {
    try {
        await AsyncStorage.setItem(DBKeys.USER, JSON.stringify(info));
    } catch (error) {
        console.error("Error in storing user info: ", error);
    }
}

export const getUserInfo = async (): Promise<UserProfile | null> =>  {
    try {
        const userInfo = await AsyncStorage.getItem(DBKeys.USER);
        if (userInfo) {
            return JSON.parse(userInfo) as UserProfile;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in getting user info: ", error);
        return null;
    }
}

export const storeToken = async (token: string, refreshToken: string) => {
    try {
        await AsyncStorage.setItem(DBKeys.TOKEN, JSON.stringify({
            token: token,
            refreshToken: refreshToken
        }));
    } catch (error) {
        console.error("Error in storing token: ", error);
    }
}

export const getStoreToken = async (): Promise<{ token: string; refreshToken: string } | null> => {
    try {
        const tokenData = await AsyncStorage.getItem(DBKeys.TOKEN);
        if (tokenData) {
            return JSON.parse(tokenData) as { token: string; refreshToken: string };
        } else {
            return null;
        }            
    } catch (error) {
        console.error("Error in getting token: ", error);
        return null;
    }
}

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error("Error in clearing all data: ", error);
    }
}
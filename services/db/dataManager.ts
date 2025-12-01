import AsyncStorage from '@react-native-async-storage/async-storage';
import { DBKeys } from './model/keys';
import { User } from '@/contexts/model/user';

export const storeUserInfo = async (info: User) => {
    try {
        await AsyncStorage.setItem(DBKeys.USER, JSON.stringify(info));
    } catch (error) {
        console.error("Error in storing user info: ", error);
    }
}

export const getUserInfo = async (): Promise<User | null> =>  {
    try {
        const userInfo = await AsyncStorage.getItem(DBKeys.USER);
        if (userInfo) {
            return JSON.parse(userInfo) as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in getting user info: ", error);
        return null;
    }
}

export const storeToken = async (token: string | null, refreshToken: string | null) => {
    try {
        await AsyncStorage.setItem(DBKeys.TOKEN, JSON.stringify({
            token: token ?? "",
            refreshToken: refreshToken ?? ""
        }));
        console.log("Token stored = ", token);
    } catch (error) {
        console.error("Error in storing token: ", error);
    }
}

export const getStoreToken = async (): Promise<{ token: string; refreshToken: string } | null> => {
    try {
        const tokenData = await AsyncStorage.getItem(DBKeys.TOKEN);
        console.log("Retrieved token data: ", tokenData);
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
        console.log("Clearing all stored data");
        await AsyncStorage.clear();
    } catch (error) {
        console.error("Error in clearing all data: ", error);
    }
}
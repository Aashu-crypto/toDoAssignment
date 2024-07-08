
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'USER_ID';

export const getUserId = async (): Promise<string> => {
  let userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

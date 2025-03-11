import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBuyerToken = async (): Promise<string | null> => {
  try {
    const buyToken = await AsyncStorage.getItem('buyToken');
    return buyToken;
  } catch (error) {
    console.error('Error getting buyToken:', error);
    return null;
  }
};

export const setBuyToken = async (token: string): Promise<void> => {
  try {
    const buyToken = await AsyncStorage.setItem('buyToken', token);
  } catch (error) {
    console.error('Error getting buyToken:', error);
  }
};

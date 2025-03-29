import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiClient} from '../services/api';
import {showToast} from './toast';

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

export const manageCart = async (productId: string, action: string) => {
  try {
    const res = await apiClient.post(`/buyer/action-cart`, {
      action: action,
      productId,
    });
    showToast('success', res.data.message);
  } catch (error: any) {
    console.log(error);
    showToast('error', 'Error', error.message);
  }
};

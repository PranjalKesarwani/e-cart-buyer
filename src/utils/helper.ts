import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiClient} from '../services/api';
import {showToast} from './toast';
import {Dispatch} from '@reduxjs/toolkit';
import {
  getCarts,
  getWishlists,
  setCartItemsCount,
  setSelectedCart,
} from '../redux/slices/buyerSlice';
import {TCart} from '../types';

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

export const calculateCartItemsCount = (carts: TCart[]) => {
  let cartItemsCount = 0;
  for (const cart of carts) {
    cartItemsCount += cart.items.length;
  }

  return cartItemsCount;
};

export const manageCart = async (
  productId: string,
  action: string,
  quantity = 1,
  dispatch: Dispatch,
  selectedCart?: TCart,
) => {
  try {
    const res = await apiClient.post(`/buyer/action-cart`, {
      action: action,
      productId,
      quantity,
    });
    const newCarts = await dispatch(getCarts() as any).unwrap();
    const newCart = newCarts.cart.find(
      (cartData: TCart) => cartData._id === selectedCart?._id,
    );
    dispatch(setSelectedCart(newCart));
    console.log('--------->>>>>>', newCarts);
    const cartItemsCount = calculateCartItemsCount(newCarts.cart);
    dispatch(setCartItemsCount(cartItemsCount));
    showToast('success', res.data.message);
    return newCarts;
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error.response?.data?.message || error.message || 'Something went wrong';
    showToast('info', 'Error', errorMessage);
  }
};

export const manageWishList = async (
  productId: string,
  isFavorite: Boolean,
  dispatch: Dispatch,
) => {
  try {
    const action = isFavorite ? 'ADD' : 'REMOVE';
    const res: any = await apiClient.post('/buyer/action-wishlist', {
      productId: productId,
      action,
    });

    dispatch(getWishlists() as any);
    if (!res?.data.success) throw new Error(res?.data.message);
    showToast('success', res.data.message, '');
  } catch (error: any) {
    console.log('Error in manageWishList', error);
    showToast('error', 'Error', error.message);
  }
};

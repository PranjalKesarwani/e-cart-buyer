import axios from 'axios';
import {API_URL} from '../config';
import {debounce, setBuyToken} from '../utils/helper';
import {apiClient} from './api';
import {getCurrentLocation} from './locationService';
import MapView from 'react-native-maps';
import {IAddress, OTPResult, SendOTPOptions, TProduct} from '../types';
import {Alert} from 'react-native';
import {showToast} from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../navigation/navigationService';

export const giveLocationPermission = async () => {
  try {
    const location = await getCurrentLocation();
    if (location) {
      console.log('Location is:', location.coords);
      const updateLocationInfo = await apiClient.get(
        `${API_URL}/buyer/get-address-latlang?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`,
      );
      console.log('Location updated successfully:', updateLocationInfo.data);
      return {
        status: true,
        data: updateLocationInfo.data,
        message: 'Location fetched successfully!',
      };
      // navigation.navigate('DrawerNavigator');
    } else {
      console.log('Location permission denied or unavailable');
      return {
        status: false,
        data: null,
        message: 'Location permission denied or unavailable',
      };
    }
  } catch (error: any) {
    console.error('Error getting location:', error);
    const errorMessage =
      error?.message || error?.response?.message || 'Something went wrong!';
    return {status: false, data: null, message: errorMessage};
  }
};

export const addBuyerAddress = async (payload: any) => {
  try {
    const res = await apiClient.post(`${API_URL}/buyer/add-address`, payload);
    if (res.status === 200) {
      return {
        status: true,
        message: 'Address added successfully!',
        data: res.data,
      };
    }
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.message || 'Something went wrong!';
    return {status: false, data: null, message: errorMessage};
  }
};

export const handleSearch = debounce(
  async (text: string, setSearchQuery: any, setPredictions: any) => {
    setSearchQuery(text);
    if (text.trim().length > 1) {
      try {
        const encodedSearch = encodeURIComponent(text.trim());
        const res = await apiClient.get(
          `${API_URL}/buyer/get-location-search-results?search=${encodedSearch}`,
        );
        console.log(res.data.searchResult);
        setPredictions(res.data?.searchResult || []);
      } catch (error) {
        console.error(error);
        setPredictions([]);
        return;
      }
    }
  },
  500,
);

export const handlePlaceSelected = async (
  placeId: any,
  setMarkerPosition: any,
  setAddress: any,
  setPredictions: any,
  setSearchQuery: any,
  mapRef: React.RefObject<MapView>,
) => {
  try {
    const res = await apiClient.get(
      `${API_URL}/buyer/selected-location-result?placeId=${placeId}`,
    );
    if (res.data.success) {
      setMarkerPosition({
        latitude: res.data.result.lat,
        longitude: res.data.result.long,
      });
      setPredictions([]);
      setSearchQuery('');
      setAddress(res.data.result.formattedAddress);
      const newCoords = {
        latitude: parseFloat(res.data.result.lat),
        longitude: parseFloat(res.data.result.long),
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...newCoords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000,
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const placeOrder = async (cartId: string, activeAddress: IAddress) => {
  try {
    if (!cartId || !activeAddress)
      return {
        status: false,
        data: null,
        message: 'Cart ID &  active address is required!',
      };
    const res = await apiClient.post(`${API_URL}/buyer/place-order`, {
      cartId,
      deliveryAddress: activeAddress,
    });
    if (res.status === 201) {
      return {
        status: true,
        message: 'Order placed successfully!',
        data: res.data,
      };
    }
    return {
      status: false,
      data: null,
      message: 'Failed to place order. Please try again.',
    };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.message || 'Something went wrong!';
    return {status: false, data: null, message: errorMessage};
  }
};

export const placeBuyNowOrder = async (
  product: TProduct,
  activeAddress: IAddress,
  quantity: number,
) => {
  try {
    if (!product || !activeAddress)
      return {
        status: false,
        data: null,
        message: 'product &  active address is required!',
      };
    const res = await apiClient.post(`${API_URL}/buyer/place-buy-now-order`, {
      product,
      shopId: product.shopId,
      deliveryAddress: activeAddress,
      quantity: quantity,
    });
    if (res.status === 201) {
      return {
        status: true,
        message: 'Order placed successfully!',
        data: res.data,
      };
    }
    return {
      status: false,
      data: null,
      message: 'Failed to place order. Please try again.',
    };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.message || 'Something went wrong!';
    return {status: false, data: null, message: errorMessage};
  }
};

export const handleLogout = async () => {
  try {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            const response = await apiClient.get('/buyer/logout'); // or '/auth/logout'
            if (response.status === 200) {
              await AsyncStorage.removeItem('buyToken');
              showToast(
                'success',
                response.data.message || 'Logged out successfully',
              );
              // if (navigationRef.isReady()) {
              //   navigationRef.reset({
              //     index: 0,
              //     routes: [{name: 'LoginScreen'}],
              //   });
              // }
              navigate('LoginScreen');

              return {status: true, message: 'Logged out successfully!'};
            }
          },
        },
      ],
      {cancelable: true},
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error?.message ||
      'Logout failed. Please try again.';
    showToast('error', errorMessage);
    return {status: false, message: 'Error!'};
  }
};

export const handleSendOTP = async (
  phoneNumber: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  options?: SendOTPOptions,
): Promise<OTPResult> => {
  const opts = {
    timeout: 30000,
    showToasts: true,
    ...options,
  };

  // Normalize input
  const number = phoneNumber?.trim() ?? '';

  const invalidResult: OTPResult = {
    status: false,
    message: 'Please enter a valid phone number',
    data: null,
  };

  if (!number || number.length != 10) {
    if (opts.showToasts) showToast('error', invalidResult.message);
    return invalidResult;
  }

  let result: OTPResult = {status: false, message: 'Unknown error', data: null};

  // set loading only if component still mounted or no ref provided
  if (!opts.isMountedRef || opts.isMountedRef.current) setIsLoading(true);

  try {
    const res = await apiClient.post(
      '/buyer/send-otp',
      {mobile: number},
      {
        // axios supports both timeout and signal in modern versions
        timeout: opts.timeout,
        signal: opts.signal,
      },
    );

    if (res?.data?.success) {
      result = {
        status: true,
        message: res.data.message || 'OTP sent',
        data: null,
      };
      if (opts.showToasts) showToast('success', result.message);
    } else {
      result = {
        status: false,
        message: res?.data?.message || 'Failed to send OTP',
        data: null,
      };
      if (opts.showToasts) showToast('error', result.message);
    }
  } catch (error: any) {
    // cancelled?
    const isCanceled =
      axios.isCancel?.(error) ||
      error?.name === 'CanceledError' ||
      error?.message === 'canceled' ||
      opts.signal?.aborted;

    if (isCanceled) {
      result = {status: false, message: 'Request cancelled', data: null};
      // Usually don't toast on cancellation (noisy); leave it to caller if needed
    } else {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'An error occurred while sending OTP';
      result = {status: false, message: errorMessage, data: null};
      if (opts.showToasts) showToast('error', errorMessage);
    }
  } finally {
    // Only set loading false if component still mounted (if a ref was provided)
    if (!opts.isMountedRef || opts.isMountedRef.current) {
      setIsLoading(false);
    }
  }

  return result;
};

// export const verifyOtp = async (
//   otp: (string | undefined)[],
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   phoneNumber: string,
// ) => {
//   if (otp.join('').length !== 6) {
//     showToast('error', 'Please enter complete OTP');
//     return;
//   }

//   try {
//     setIsLoading(true);
//     const res = await apiClient.post('/buyer/verify-otp', {
//       mobile: phoneNumber,
//       otp: otp.join(''),
//     });

//     if (res.data.success) {
//       setBuyToken(res.data.buyerToken);
//       showToast('success', 'Success!', 'OTP Verified Successfully!');
//       navigate('DrawerNavigator');
//     }
//   } catch (error: any) {
//     const errorMessage =
//       error.response?.data?.message || error.message || 'Verification failed';
//     showToast('error', errorMessage);
//   } finally {
//     setIsLoading(false);
//   }
// };
export const verifyOtp = async (
  otp: (string | undefined)[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  phoneNumber: string,
  options?: SendOTPOptions,
): Promise<OTPResult> => {
  const opts = {timeout: 10000, showToasts: true, ...options};

  // Normalize & validate OTP
  const otpCode = (otp ?? []).map(c => (c ?? '').trim()).join('');
  const invalidResult: OTPResult = {
    status: false,
    message: 'Please enter complete OTP',
    data: null,
  };

  if (otpCode.length !== 6) {
    if (opts.showToasts) showToast('error', invalidResult.message);
    return invalidResult;
  }

  let result: OTPResult = {status: false, message: 'Unknown error', data: null};

  // set loading only if component still mounted or no ref provided
  if (!opts.isMountedRef || opts.isMountedRef.current) setIsLoading(true);

  try {
    const res = await apiClient.post(
      '/buyer/verify-otp',
      {mobile: phoneNumber, otp: otpCode},
      {timeout: opts.timeout, signal: opts.signal},
    );

    if (res?.data?.success) {
      // persist token (keeps existing behavior)
      if (res.data.buyerToken) {
        setBuyToken(res.data.buyerToken);
      }

      result = {
        status: true,
        message: res.data.message || 'OTP verified',
        data: res.data,
      };
      if (opts.showToasts) {
        showToast('success', 'Success!', 'OTP Verified Successfully!');
      }

      // Optionally let caller do navigation via returned result
      return result;
    } else {
      result = {
        status: false,
        message: res?.data?.message || 'OTP verification failed',
        data: res?.data ?? null,
      };
      if (opts.showToasts) showToast('error', result.message);
      return result;
    }
  } catch (error: any) {
    const isCanceled =
      axios.isCancel?.(error) ||
      error?.name === 'CanceledError' ||
      error?.message === 'canceled' ||
      opts.signal?.aborted;

    if (isCanceled) {
      result = {status: false, message: 'Request cancelled', data: null};
      // usually don't toast cancellations
    } else {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Verification failed';
      result = {status: false, message: errorMessage, data: null};
      if (opts.showToasts) showToast('error', errorMessage);
    }

    return result;
  } finally {
    if (!opts.isMountedRef || opts.isMountedRef.current) setIsLoading(false);
  }
};

export const getHomeCats = async () => {
  try {
    const res = await apiClient.get('/buyer/get-home-cats');

    if (res.data.success) {
      return {status: true, message: res.data.message, data: res.data.data};
    }
    return {status: false, message: res.data.message, data: null};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error?.message || 'Server Error!';
    return {status: false, message: errorMessage, data: null};
  }
};

export const getSecondLevelCats = async () => {
  try {
    const res = await apiClient.get('/buyer/second-level-cats');

    if (res.data.success) {
      return {status: true, message: res.data.message, data: res.data.data};
    }
    return {status: false, message: res.data.message, data: null};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error?.message || 'Server Error!';
    return {status: false, message: errorMessage, data: null};
  }
};

export const getSubCatsForShop = async (
  shopId: string,
  catId: string | null,
) => {
  try {
    const abortController = new AbortController();
    const res = await apiClient.get(
      `/buyer/shops/${shopId}/categories/${catId}`,
      {signal: abortController.signal},
    );

    if (res.data.success) {
      return {status: true, message: res.data.message, data: res.data};
    }
    return {status: false, message: res.data.message, data: null};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error?.message || 'Server Error!';
    return {status: false, message: errorMessage, data: null};
  }
};

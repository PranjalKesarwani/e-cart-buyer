import {API_URL} from '../config';
import {apiClient} from './api';
import {getCurrentLocation} from './locationService';

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

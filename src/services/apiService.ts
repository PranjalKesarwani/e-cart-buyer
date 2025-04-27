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
      return {status: true, data: updateLocationInfo.data};
      // navigation.navigate('DrawerNavigator');
    } else {
      console.log('Location permission denied or unavailable');
      return {status: false, data: null};
    }
  } catch (error) {
    console.error('Error getting location:', error);
    return {status: false, data: null};
  }
};

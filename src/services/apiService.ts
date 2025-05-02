import axios from 'axios';
import {API_URL} from '../config';
import {debounce} from '../utils/helper';
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

const handleSearch = debounce(
  async (text: string, setSearchQuery: any, setPredictions: any) => {
    setSearchQuery(text);
    if (text.trim().length > 1) {
      try {
        const encodedSearch = encodeURIComponent(text.trim());
        const res = await axios.get(
          `${API_URL}/buyer/get-location-search-results?search=${encodedSearch}`,
        );
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

const handlePlaceSelected = async (
  placeId: any,
  setMarkerPosition: any,
  setAddress: any,
  setPredictions: any,
  setSearchQuery: any,
) => {
  try {
    const res = await axios.get(
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
    }
  } catch (error) {
    console.error(error);
  }
};

import {PermissionsAndroid, Alert, Linking, Platform} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import axios from 'axios';
import {showToast} from '../utils/toast';
import {API_URL} from '../config';
import {apiClient} from './api';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'We need your location for a better experience!',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<GeoPosition | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    showToast('error', 'Location permission denied');
    return null;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => {
        console.error('Geolocation error:', error.code, error.message);
        showToast('error', `Location error: ${error.message}`);

        if (error.code === 2) {
          Alert.alert(
            'Location Required',
            'Please enable device location services',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Settings', onPress: () => Linking.openSettings()},
            ],
          );
        }

        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    const response = await apiClient.get(
      `${API_URL}/buyer/get-address-latlang?latitude=${latitude}&longitude=${longitude}`,
    );
    const data = response.data;
    if (data.success) {
      return data.formattedAddress;
    } else if (!data.success) {
      console.warn('No address found for these coordinates');
      return null;
    } else {
      throw new Error(
        `Geocoding error: ${data.success} - ${data.error_message || ''}`,
      );
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('API request failed:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

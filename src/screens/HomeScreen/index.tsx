import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import {RootDrawerParamList} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import axios from 'axios';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'HomeScreen'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [confirmedLocation, setConfirmedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [confirmedAddress, setConfirmedAddress] = useState<string>(
    'Opposite Ramleela Maidan, 221507',
  );

  const windowHeight = Dimensions.get('window').height;
  const modalHeight = windowHeight;

  const [globalCats, setGlobalCats] = useState<any>([]);

  const getGlobalCategories = async () => {
    try {
      const res = await apiClient.get('/buyer/categories');
      if (!res?.data.success) throw new Error(res?.data.message);
      setGlobalCats(res.data.categories);
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const requestLocationPermission = async () => {
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
      console.warn(err);
      return false;
    }
  };

  const checkLocationServices = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      showToast('error', 'Location permission denied');
      return;
    }

    try {
      Geolocation.getCurrentPosition(
        position => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(newCoords);
          console.log('Location enabled:', newCoords);
        },
        error => {
          console.log('Location error:', error.code, error.message);
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
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
      );
    } catch (error) {
      console.log('Error checking location:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await new Promise<Geolocation.GeoPosition>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        },
      );

      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log('Current location:', newCoords);
      setUserLocation(newCoords);

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...newCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    } catch (error: any) {
      console.log('Location error:', error.code, error.message);
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
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    const API_KEY = 'AIzaSyDOz_eMVh03ENc2EBiAgr0eRImieYsu6fk'; // Should be server-side!
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log('Geocoding response:', data);
      switch (data.status) {
        case 'OK':
          return data.results[0].formatted_address;
        case 'ZERO_RESULTS':
          console.warn('No address found for these coordinates');
          return null;
        default:
          throw new Error(
            `Geocoding error: ${data.status} - ${data.error_message || ''}`,
          );
      }
    } catch (error) {
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

  const initializeLocation = async () => {
    await checkLocationServices();
    if (userLocation) {
      setConfirmedLocation(userLocation);
      const address = await getAddressFromCoordinates(
        userLocation.latitude,
        userLocation.longitude,
      );
      if (address) {
        setConfirmedAddress(address);
      }
    }
  };

  useEffect(() => {
    getGlobalCategories();
    initializeLocation();
  }, []);

  const handleCardPress = (item: any) => {
    navigation.navigate('ShopListScreen', {category: item});
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.locationSelector}>
          <View style={styles.locationContent}>
            <Icons name="enviromento" size={20} color={Theme.colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Username</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.locationAddress}>
                {confirmedAddress}
              </Text>
            </View>
            <Icons name="down" size={16} color={Theme.colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeMessage}>
          Discover something amazing today!
        </Text>

        {/* Categories Grid */}
        <FlatList
          data={globalCats}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.categoryCard}
              activeOpacity={0.9}
              onPress={() => handleCardPress(item)}>
              <View style={styles.categoryContent}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.categoryImage}
                    source={{uri: item.image}}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Icons name="close" size={24} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* ... map view remains the same ... */}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={async () => {
              if (userLocation) {
                setConfirmedLocation(userLocation);
                const address = await getAddressFromCoordinates(
                  userLocation.latitude,
                  userLocation.longitude,
                );
                if (address) {
                  setConfirmedAddress(address);
                }
                setModalVisible(false);
              }
            }}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationButton}>
            <Icons name="enviromento" size={24} color={Theme.colors.white} />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const colors = {
  primary: '#6C5CE7', // Sophisticated purple
  secondary: '#FF9F43', // Warm orange
  background: '#F8F9FA', // Light background
  text: '#2D3436', // Dark text
  darkGray: '#636E72', // Secondary text
  lightGray: '#DFE6E9', // Borders
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  locationSelector: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  locationTitle: {
    ...Theme.typography.caption,
    color: Theme.colors.gray,
  },
  locationAddress: {
    ...Theme.typography.body1,
    color: Theme.colors.darkText,
    marginTop: Theme.spacing.xs,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Theme.spacing.sm,
  },
  welcomeMessage: {
    ...Theme.typography.h4,
    color: Theme.colors.darkText,
    marginVertical: Theme.spacing.lg,
    textAlign: 'center',
  },
  categoryCard: {
    flex: 1,
    margin: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.xs,
    paddingBottom: Theme.spacing.xs,
  },
  categoryContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: Theme.spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderTopEndRadius: Theme.borderRadius.sm,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: Theme.borderRadius.sm,
  },
  categoryName: {
    ...Theme.typography.body1,
    color: Theme.colors.darkText,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  gridContainer: {
    padding: Theme.spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  modalTitle: {
    ...Theme.typography.h5,
    color: Theme.colors.darkText,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  locationButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -40,
    alignItems: 'center',
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    backgroundColor: `${Theme.colors.primary}22`,
    width: 40,
    height: 40,
    borderRadius: 20,
    top: -5,
    zIndex: -1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  confirmButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.white,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    right: Theme.spacing.md,
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
});

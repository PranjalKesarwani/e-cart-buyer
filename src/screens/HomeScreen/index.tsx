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
import LocationBottomSheet from '../../components/LocationBottomSheet';
import {RootDrawerParamList} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import axios from 'axios';
import {useAppSelector} from '../../redux/hooks';
import {isLocationEnabled} from '../../utils/helper';
import {giveLocationPermission} from '../../services/apiService';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'HomeScreen'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const {lastSavedformattedAddress, hasSetLocation, name} = useAppSelector(
    state => state.buyer,
  );
  const [addressToShow, setAddressToShow] = useState<string>(
    lastSavedformattedAddress,
  );
  const savedAddresses: any[] = [];
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // const [confirmedLocation, setConfirmedLocation] = useState<{
  //   latitude: number;
  //   longitude: number;
  // } | null>(null);
  // const [confirmedAddress, setConfirmedAddress] = useState<string>(
  //   'Opposite Ramleela Maidan, 221507',
  // );

  const windowHeight = Dimensions.get('window').height;
  // const modalHeight = windowHeight;

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
      // const x = giveLocationPermission()
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
    // await checkLocationServices();
    // if (userLocation) {
    //   // setConfirmedLocation(userLocation);
    //   const address = await getAddressFromCoordinates(
    //     userLocation.latitude,
    //     userLocation.longitude,
    //   );
    //   if (address) {
    //     // setConfirmedAddress(address);
    //   }
    // }
    const {status, message, data} = await giveLocationPermission();
    if (status) {
      setAddressToShow(data.address);
    }
  };

  const checkIsLocationEnabled = async () => {
    const locationEnableInfo = await isLocationEnabled();
    if (!locationEnableInfo) setShowLocationSheet(true);
  };

  useEffect(() => {
    checkIsLocationEnabled();
    getGlobalCategories();
    initializeLocation();
  }, []);

  const handleCardPress = (item: any) => {
    navigation.navigate('ShopListScreen', {category: item});
  };

  const handleAddressSelect = (address: string) => {
    // setConfirmedAddress(address);
    // You might want to update the location coordinates here as well
  };

  const handleHomeScreenLocation = () => {
    try {
      // setModalVisible(true);

      navigation.navigate('LocationConfirmationScreen');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleHomeScreenLocation();
          }}
          style={styles.locationSelector}>
          <View style={styles.locationContent}>
            <Icons name="enviromento" size={20} color={Theme.colors.primary} />
            <View style={[styles.locationTextContainer]}>
              <Text
                style={[styles.locationTitle, {color: Theme.colors.primary}]}>
                {name}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.locationAddress]}>
                {addressToShow}
              </Text>
            </View>
            <Icons name="down" size={16} color={Theme.colors.bharatPurple} />
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
              style={[styles.categoryCard]}
              activeOpacity={0.9}
              onPress={() => handleCardPress(item)}>
              <View style={[styles.categoryContent]}>
                <View style={[styles.imageContainer]}>
                  <Image
                    style={[styles.categoryImage, {borderTopRightRadius: 5.6}]}
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
              <Icons name="close" size={24} color={Theme.colors.baseYellow} />
            </TouchableOpacity>
          </View>

          <MapView
            style={styles.map}
            ref={mapRef}
            provider="google"
            region={
              userLocation
                ? {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : undefined
            }
            onRegionChangeComplete={region => {
              setUserLocation({
                latitude: region.latitude,
                longitude: region.longitude,
              });
            }}
            showsUserLocation={true}
            followsUserLocation={false}>
            {userLocation && (
              <Marker coordinate={userLocation}>
                <View style={styles.customMarker}>
                  <Icons name="enviromento" size={30} color="#003366" />
                  <View style={styles.markerPulse} />
                </View>
              </Marker>
            )}
          </MapView>

          <View style={styles.centerMarker}>
            <Icons name="enviromento" size={30} color="#003366" />
            <View style={styles.markerPulse} />
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={async () => {
              if (userLocation) {
                // setConfirmedLocation(userLocation);
                const address = await getAddressFromCoordinates(
                  userLocation.latitude,
                  userLocation.longitude,
                );
                if (address) {
                  // setConfirmedAddress(address);
                }
                setModalVisible(false);
              }
            }}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationButton}>
            <Icons name="enviromento" size={30} color="#FFF" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <LocationBottomSheet
        isVisible={showLocationSheet}
        onClose={() => setShowLocationSheet(false)}
        savedAddresses={savedAddresses}
        onEnableLocation={getCurrentLocation}
        onAddressSelect={handleAddressSelect}
      />
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
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  locationSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
    color: Theme.colors.primary,
  },
  locationTitle: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 7,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 24,
    textAlign: 'center',
    lineHeight: 32,
  },
  // gridContainer: {
  //   paddingBottom: 24,
  // },
  categoryIcon: {
    backgroundColor: '#F0F2FE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  // modalContent: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // modalText: {
  //   fontSize: 16,
  //   color: colors.darkGray,
  //   marginBottom: 20,
  // },
  // currentLocationButton: {
  //   position: 'absolute',
  //   bottom: 20,
  //   alignSelf: 'center',
  //   backgroundColor: 'white',
  //   padding: 15,
  //   borderRadius: 30,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   elevation: 5,
  // },
  locationButtonText: {
    marginLeft: 10,
    color: '#003366',
    fontWeight: 'bold',
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderWidth: 1, // Subtle border
    borderColor: '#E0E0E0', // Light gray for professionalism
    borderRadius: 8, // Rounded corners
    backgroundColor: '#FFFFFF', // Clean white background
    elevation: 2, // Subtle shadow for depth
    paddingBottom: 3, // Internal spacing
  },
  categoryContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 8, // Space at the bottom
  },
  imageContainer: {
    width: '100%',
    height: 100, // Increased height for better image visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 8, // Rounded top corners
  },
  categoryImage: {
    width: '100%', // Slightly less than full width for padding
    height: '100%', // Maintains aspect ratio
    resizeMode: 'cover', // Ensures image fits without distortion
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600', // Slightly bold for a polished look
    color: '#333', // Dark gray for readability
    marginTop: 8, // Space between image and text
    textAlign: 'center', // Center text for consistency
  },
  gridContainer: {
    padding: 10, // Padding around the grid
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // markerPulse: {
  //   position: 'absolute',
  //   backgroundColor: '#00336622',
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   zIndex: -1,
  // },
  // Ensure your map has proper dimensions
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8, // Use 80% of screen height
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
    backgroundColor: 'rgba(0, 51, 102, 0.2)',
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
    backgroundColor: Theme.colors.bharatPurple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: Theme.colors.bharatPurple,
    padding: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

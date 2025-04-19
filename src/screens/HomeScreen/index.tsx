import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
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
import Title from '../../components/Title';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
// import {colors, Theme} from '../../theme/theme'; // Assuming colors are defined in theme

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'HomeScreen'>;

type TCategoryCards = {
  id: number;
  text: string;
};

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const modalHeight = windowHeight;
  const [mLat, setMLat] = useState<number>(37.4219983);
  const [mLong, setMLong] = useState<number>(-122.084);
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
      // Attempt to get current position to check if location services are enabled
      Geolocation.getCurrentPosition(
        position => {
          // Location is enabled, set coordinates
          setMLat(position.coords.latitude);
          setMLong(position.coords.longitude);
          console.log('Location enabled:', position);
        },
        error => {
          // Location services are disabled or other error
          if (error.code === 2) {
            // Location services disabled
            Alert.alert(
              'Location Services Disabled',
              'Please enable location services for a better experience.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(), // Open device settings
                },
              ],
            );
          } else {
            console.log('Geolocation error:', error.code, error.message);
            showToast('error', 'Unable to get location');
          }
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.log('Error checking location:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        showToast('error', 'Location permission denied');
        return;
      }

      const location = await new Promise<Geolocation.GeoPosition>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
            showLocationDialog: true,
          });
        },
      );

      setMLat(location.coords.latitude);
      setMLong(location.coords.longitude);
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

  useEffect(() => {
    getGlobalCategories();
    checkLocationServices(); // Check location services on screen load
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
            <Icons
              name="enviromento"
              size={20}
              color={Theme.colors.bharatPurple}
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Username</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.locationAddress}>
                Opposite Ramleela Maidan, 221507
              </Text>
            </View>
            <Icons name="down" size={16} color={colors.darkGray} />
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
              <Icons name="close" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>

          <MapView
            style={styles.map}
            provider="google"
            region={{
              latitude: mLat || 37.4219983,
              longitude: mLong || -122.084,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true} // Add this to show default blue dot
            followsUserLocation={true} // Add this to follow location
          >
            {mLat !== 0 && mLong !== 0 && (
              <Marker coordinate={{latitude: mLat, longitude: mLong}}>
                {/* Custom Marker Design */}
                <View style={styles.customMarker}>
                  <Icons name="enviromento" size={30} color="#003366" />
                  <View style={styles.markerPulse} />
                </View>
              </Marker>
            )}
          </MapView>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationButton}>
            <Icons name="enviromento" size={30} color="#003366" />
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
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
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
  markerPulse: {
    position: 'absolute',
    backgroundColor: '#00336622',
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: -1,
  },
  // Ensure your map has proper dimensions
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8, // Use 80% of screen height
  },
});

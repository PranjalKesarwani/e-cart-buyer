import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {RootDrawerParamList} from '../../types'; // Assuming you only need RootDrawerParamList
import Icons from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Title from '../../components/Title';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient, request} from '../../services/api';
import {Theme} from '../../theme/theme';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'HomeScreen'>;

type TCategoryCards = {
  id: number;
  text: string;
};

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const modalHeight = windowHeight;
  const [mLat, setMLat] = useState<number>(0);
  const [mLong, setMLong] = useState<number>(0);
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

  useEffect(() => {
    requestLocationPermission();
    getGlobalCategories();
  }, []);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'We need your location for your better experience!' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    console.log('trying to get current location');
    try {
      Geolocation.getCurrentPosition(
        position => {
          setMLat(position.coords.latitude);
          setMLong(position.coords.longitude);
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log('fallen into error');
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.log('--xx--', error);
    }
  };

  const handleCardPress = (item: any) => {
    // console.log('item', item);
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
            <Icons name="enviromento" size={20} color={colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Current Store</Text>
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
                {/* Display Image Instead of Icon */}
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
            initialRegion={{
              latitude: 28.68344961110582,
              longitude: 77.21538250329944,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker coordinate={{latitude: mLat, longitude: mLong}} />
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
    paddingHorizontal: 16,
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
  map: {
    flex: 1,
  },
  currentLocationButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '600', // Slightly bold for a polished look
    color: '#333', // Dark gray for readability
    marginTop: 8, // Space between image and text
  },
  gridContainer: {
    padding: 10, // Padding around the grid
  },
});

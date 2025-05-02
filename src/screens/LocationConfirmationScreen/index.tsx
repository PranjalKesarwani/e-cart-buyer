import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  BackHandler,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../theme/theme';
import {
  giveLocationPermission,
  handlePlaceSelected,
  handleSearch,
} from '../../services/apiService';
import {cleanAddress, isLocationEnabled} from '../../utils/helper';
import {useAppSelector} from '../../redux/hooks';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'; // Install this package

type LocationSetupProps = NativeStackScreenProps<
  RootStackParamList,
  'LocationConfirmationScreen'
>;

const {width, height} = Dimensions.get('window');

const LocationConfirmationScreen = ({navigation}: LocationSetupProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const {lastSavedformattedAddress} = useAppSelector(state => state.buyer);
  console.log('777777777777', lastSavedformattedAddress);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 25.4822367,
    longitude: 81.9762467,
  });
  const [predictions, setPredictions] = useState([]);
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [address, setAddress] = useState(lastSavedformattedAddress);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const checkLocationEnabled = async () => {
    const isEnabled = await isLocationEnabled();
    setLocationEnabled(isEnabled);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    checkLocationEnabled();

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000,
      ); // 1000ms animation duration
    }
  }, [markerPosition]);

  const handleLocationPermission = async () => {
    try {
      const {status, message, data} = await giveLocationPermission();

      if (status) {
        setMarkerPosition({
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lng),
        });
        const cleanAdd = cleanAddress(data.formattedAddress);
        setAddress(cleanAdd);
        setLocationEnabled(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    handleLocationPermission();
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const addMoreAddressDetails = () => {
    try {
      const payload = {
        formattedAddress: address,
        markerPosition,
      };
      navigation.navigate('AddressInputScreen', payload);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={markerPosition}
          draggable
          onDragEnd={e => setMarkerPosition(e.nativeEvent.coordinate)}
        />
      </MapView>

      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <Icons name="search" size={20} color={Theme.colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for area, street name..."
          placeholderTextColor={Theme.colors.gray}
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setShowResults(text.length > 0);
            handleSearch(text, setSearchQuery, setPredictions);
          }}
          onBlur={() => setShowResults(false)}
        />

        {/* Search results list */}
        {showResults && (
          <FlatList
            style={styles.predictionsList}
            data={predictions}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item: any) => item.placeId}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() =>
                  handlePlaceSelected(
                    item.placeId,
                    setMarkerPosition,
                    setAddress,
                    setPredictions,
                    setSearchQuery,
                  )
                }>
                <Text style={styles.mainText}>{item.main_text}</Text>
                <Text style={styles.secondaryText}>{item.secondary_text}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Back Button */}
      <View style={[styles.backButtonHeader]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: Theme.colors.black}}>
          Confirm Delivery Location
        </Text>
      </View>

      {/* Location Floating Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleLocationPermission}>
        <Icons name="my-location" size={24} color={Theme.colors.primary} />
      </TouchableOpacity>

      {/* Address Details Section */}
      {locationEnabled ? (
        <Animated.View
          style={[styles.addressContainer, {transform: [{translateY}]}]}>
          <Text style={styles.deliveryText}>Delivering Your Order To</Text>
          <View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              },
            ]}>
            <Icons
              name="location-on"
              size={32}
              color={Theme.colors.primary}
              style={styles.locationIcon}
            />
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <TouchableOpacity
            style={styles.addDetailsButton}
            onPress={() => {
              addMoreAddressDetails();
            }}>
            <Text style={styles.addDetailsText}>Add More Address Details</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={[styles.permissionSheet, {transform: [{translateY}]}]}>
          <Text style={styles.permissionTitle}>
            Location Permission Not Enabled
          </Text>
          <Text style={styles.permissionText}>
            Please enable your location permission to get accurate delivery
            options
          </Text>
          <TouchableOpacity
            onPress={() => handleLocationPermission()}
            style={styles.enableButton}>
            <Text style={styles.enableButtonText}>Enable Device Location</Text>
          </TouchableOpacity>
          {lastSavedformattedAddress ? (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => addMoreAddressDetails()}>
              <Text style={styles.continueButtonText}>
                Continue with{' '}
                <Text style={styles.boldAddress}>
                  {lastSavedformattedAddress}
                </Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  predictionsList: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    elevation: 3,
    zIndex: 999,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mainText: {
    fontSize: 16,
    color: Theme.colors.black,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: Theme.colors.gray,
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Theme.colors.text,
    fontSize: 16,
  },
  backButtonHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    backgroundColor: Theme.colors.white,
    elevation: 2,
    width: width,
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    paddingRight: 5,
  },
  locationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    padding: 15,
    backgroundColor: Theme.colors.white,
    borderRadius: 30,
    elevation: 4,
  },
  addressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    elevation: 10,
  },
  deliveryText: {
    fontSize: 16,
    color: Theme.colors.gray,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: 20,
  },
  locationIcon: {
    marginBottom: 20,
  },
  addDetailsButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
  },
  addDetailsText: {
    color: Theme.colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
  permissionSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    height: height * 0.4,
    elevation: 10,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Theme.colors.gray,
    marginBottom: 30,
    lineHeight: 24,
    textAlign: 'center',
  },
  enableButton: {
    backgroundColor: Theme.colors.success,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginBottom: 15,
  },
  enableButtonText: {
    color: Theme.colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  continueButton: {
    borderWidth: 2,
    borderColor: Theme.colors.success,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Theme.colors.success,
    fontWeight: '600',
    fontSize: 16,
  },
  boldAddress: {
    fontWeight: '700',
  },
});

export default LocationConfirmationScreen;

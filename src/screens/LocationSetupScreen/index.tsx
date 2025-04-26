import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../theme/theme';
import Title from '../../components/Title';
import {getCurrentLocation} from '../../services/locationService';

type LocationSetupProps = NativeStackScreenProps<
  RootStackParamList,
  'LocationSetupScreen'
>;

const LocationSetupScreen = ({navigation}: LocationSetupProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Handle back button on Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    return () => backHandler.remove();
  }, []);

  const handleLocationPermission = async () => {
    const res = await getCurrentLocation();
    console.log('-----------', res);
  };

  const handleManualAddress = () => {
    navigation.navigate('AddressInputScreen');
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <View style={styles.container}>
      {/* Overlay Background */}
      <Animated.View style={[styles.overlay]} />

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{translateY}],
          },
        ]}>
        <View style={styles.header}>
          <Icons
            name="location-on"
            size={40}
            color={Theme.colors.primary}
            style={styles.locationIcon}
          />
          <Title fontSize={32} fontWeight="800" />
          <Text style={styles.subtitle}>
            Help us serve you better by setting your location
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLocationPermission}>
          <Icons
            name="my-location"
            size={24}
            color={Theme.colors.white}
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleManualAddress}>
          <Icons
            name="edit-location-alt"
            size={24}
            color={Theme.colors.primary}
            style={styles.buttonIcon}
          />
          <Text style={styles.secondaryButtonText}>Add Address Manually</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          We need your location to show nearby stores and accurate delivery
          options
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  locationIcon: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.gray,
    marginTop: 15,
    textAlign: 'center',
    fontFamily: Theme.fonts.body,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: Theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.white,
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  primaryButtonText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  footerText: {
    textAlign: 'center',
    color: Theme.colors.gray,
    fontSize: 12,
    marginTop: 30,
    fontFamily: Theme.fonts.body,
    lineHeight: 18,
  },
});

export default LocationSetupScreen;

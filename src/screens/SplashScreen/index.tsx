import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Title from '../../components/Title';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  fetchBuyer,
  getCarts,
  getWishlists,
  setCartItemsCount,
} from '../../redux/slices/buyerSlice';
import {calculateCartItemsCount} from '../../utils/helper';
import {Theme} from '../../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import {navigate} from '../../navigation/navigationService';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

const SplashScreen = ({navigation}: SplashProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await dispatch(fetchBuyer()).unwrap();

        if (data.success) {
          if (!data.buyerInfo.name) {
            // navigation.replace('NameInfoScreen');
            navigate('NameInfoScreen');
            return;
          }
          if (!data.buyerInfo.hasSetLocation) {
            navigation.replace('LocationSetupScreen');
            return;
          }
          await dispatch(getWishlists());
          const cartInfo: any = await dispatch(getCarts()).unwrap();
          const cartItemsCount = calculateCartItemsCount(cartInfo.cart);
          dispatch(setCartItemsCount(cartItemsCount));
          setTimeout(() => {
            navigate('MainTabsNavigator');
          }, 1500);
        } else {
          navigate('LoginScreen');
        }
      } catch (error) {
        console.log(error);
        navigate('LoginScreen');
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <LinearGradient
      colors={[Theme.colors.orangeLight, Theme.colors.orangeDark]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Title should accept color/size props. If your Title doesn't, set color via container */}
          <Title />
          <Text style={styles.subtitle}>Authenticating User...</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // make gradient fill the whole screen
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    // center content vertically and horizontally
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 24,
    marginTop: 20,
    color: Theme.colors.white, // use theme
    opacity: 0.95,
  },
});

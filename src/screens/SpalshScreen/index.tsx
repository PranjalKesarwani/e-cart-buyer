import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
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

type SplashProps = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

const SplashScreen = ({navigation}: SplashProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await dispatch(fetchBuyer()).unwrap();

        if (data.success) {
          if (!data.buyerInfo.name) {
            navigation.replace('NameInfoScreen');
            return;
          }
          await dispatch(getWishlists());
          const cartInfo: any = await dispatch(getCarts()).unwrap();
          const cartItemsCount = calculateCartItemsCount(cartInfo.cart);
          dispatch(setCartItemsCount(cartItemsCount));
          setTimeout(() => {
            navigation.replace('DrawerNavigator');
          }, 1500);
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.log(error);
        navigation.replace('LoginScreen');
      }
    };

    fetchData();
  }, [dispatch]);

  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Title fontSize={36} fontWeight={'bold'} />
      <Text style={styles.subtitle}>Authenticating User...</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Background color chosen for the screen
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
});

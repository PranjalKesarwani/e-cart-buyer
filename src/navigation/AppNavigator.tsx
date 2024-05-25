import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text
} from 'react-native';
import { RootStackParamList } from '../types';

//Screens
import SplashScreen from '../screens/SpalshScreen';
import HomeScreen from '../screens/HomeScreen';

import OTPScreen from '../screens/OtpScreen';
import LoginScreen from '../screens/LoginScreen';
import NameInfoScreen from '../screens/NameInfoScreen';
import DrawerNavigator from './DrawerNavigator';
import ShopListScreen from '../screens/ShopListScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductScreen from '../screens/ProductScreen';
import SelectedProductScreen from '../screens/SelectedProductScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import AddressScreen from '../screens/AddressScreen';
import PaymentScreen from '../screens/PaymentScreen';






const Stack = createNativeStackNavigator<RootStackParamList>();




const AppNavigator = () => {
  return (

    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name='SplashScreen'
        component={SplashScreen}
        options={
          {
            title: "Splash Screen"
          }
        }
      />


      <Stack.Screen
        name='LoginScreen'
        component={LoginScreen}
        options={
          {
            title: "Login Screen"
          }
        }
      />
      <Stack.Screen
        name='OtpScreen'
        component={OTPScreen}
        options={
          {
            title: "OTP Screen"
          }
        }
      />

      <Stack.Screen
        name='NameInfoScreen'
        component={NameInfoScreen}
        options={
          {
            title: "Name info Screen"
          }
        }
      />

      <Stack.Screen
        name='DrawerNavigator'
        component={DrawerNavigator}
      />
      <Stack.Screen
        name='ShopListScreen'
        component={ShopListScreen}
      />
      <Stack.Screen
        name='ShopScreen'
        component={ShopScreen}
      />

      <Stack.Screen
        name='ProductScreen'
        component={ProductScreen}
      />
      <Stack.Screen
        name='SelectedProductScreen'
        component={SelectedProductScreen}
      />
      <Stack.Screen
        name='OrderDetailsScreen'
        component={OrderDetailsScreen}
      />
          <Stack.Screen
        name='AddressScreen'
        component={AddressScreen}
      />
           <Stack.Screen
        name='PaymentScreen'
        component={PaymentScreen}
      />



    </Stack.Navigator>

  );
};

export default AppNavigator;

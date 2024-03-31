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



const RootStack = createNativeStackNavigator<RootStackParamList>();







const AppNavigator = () => {
  return (
<RootStack.Navigator initialRouteName="SplashScreen">
<RootStack.Screen name="SplashScreen" component={SplashScreen} />


</RootStack.Navigator>

  );
};

export default AppNavigator;

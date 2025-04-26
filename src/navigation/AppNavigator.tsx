import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text} from 'react-native';
import {RootStackParamList} from '../types';

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
import OrderStatusScreen from '../screens/OrderStatusScreen';
import PersonalChatScreen from '../screens/PersonalChatScreen';
import OrderedItemDetailScreen from '../screens/OrderedItemDetailScreen';
import StatusViewer from '../screens/StatusViewer/StatusViewer';
import LocationSetupScreen from '../screens/LocationSetupScreen';
import AddressInputScreen from '../screens/AddressInputScreen';
import LocationConfirmationScreen from '../screens/LocationConfirmationScreen';
// import StatusViewer from '../screens/StatusViewer/StatusViewer';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          title: 'Splash Screen',
        }}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Login Screen',
        }}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OTPScreen}
        options={{
          title: 'OTP Screen',
        }}
      />

      <Stack.Screen
        name="NameInfoScreen"
        component={NameInfoScreen}
        options={{
          title: 'Name info Screen',
        }}
      />

      <Stack.Screen
        name="LocationSetupScreen"
        component={LocationSetupScreen}
        options={{
          title: 'Location Setup',
          animation: 'slide_from_bottom', // For iOS
        }}
      />
      <Stack.Screen
        name="AddressInputScreen"
        component={AddressInputScreen}
        options={{
          title: 'Location Setup',
          animation: 'slide_from_bottom', // For iOS
        }}
      />
      <Stack.Screen
        name="LocationConfirmationScreen"
        component={LocationConfirmationScreen}
        options={{
          title: 'Location Setup',
          animation: 'slide_from_bottom', // For iOS
        }}
      />

      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ShopListScreen" component={ShopListScreen} />
      <Stack.Screen name="ShopScreen" component={ShopScreen} />

      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen
        name="SelectedProductScreen"
        component={SelectedProductScreen}
      />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} />
      <Stack.Screen name="PersonalChatScreen" component={PersonalChatScreen} />
      <Stack.Screen
        name="StatusViewer"
        component={StatusViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderedItemDetailScreen"
        component={OrderedItemDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

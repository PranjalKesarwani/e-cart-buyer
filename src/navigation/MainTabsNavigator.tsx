import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import StatusScreen from '../screens/StatusScreen';
import AllChatScreen from '../screens/AllChatScreen';
import BidScreen from '../screens/BidScreen';
import {MainTabsParamList} from '../types';
import CartScreen from '../screens/CartScreen';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../features/account/AccountScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#25D366',
        tabBarInactiveTintColor: '#667781',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 8,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="cart-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="person-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Chats"
        component={AllChatScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="time-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;

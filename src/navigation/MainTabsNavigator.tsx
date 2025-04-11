import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import StatusScreen from '../screens/StatusScreen';
import AllChatScreen from '../screens/AllChatScreen';
import BidScreen from '../screens/BidScreen';
import {MainTabsParamList} from '../types';

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
        name="AllChatScreen"
        component={AllChatScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StatusScreen"
        component={StatusScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bid"
        component={BidScreen}
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

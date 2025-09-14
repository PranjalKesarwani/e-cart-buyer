import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
  GestureResponderEvent,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import StatusScreen from '../screens/StatusScreen';
import AllChatScreen from '../screens/AllChatScreen';
import {MainTabsParamList} from '../types';
import CartScreen from '../screens/CartScreen';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../features/account/AccountScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Theme
const PRIMARY = '#FF9933';
const INACTIVE = '#667781';
const TAB_BG = '#ffffff';

// Custom rounded floating cart button
const FloatingCartButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.floatingButtonContainer}>
      <View style={styles.floatingButton}>{children}</View>
    </TouchableOpacity>
  );
};

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
          // fontFamily: 'Inter-Medium', // uncomment if you have a UI font
        },
        tabBarStyle: styles.tabBarStyle,
        // Dynamic icon selection using route.name and focused state
        tabBarIcon: ({focused, color, size}) => {
          // map route names to ionicon base names
          const map: Record<string, string> = {
            Home: 'home',
            Cart: 'cart',
            Account: 'person',
            Chats: 'chatbubbles',
            Status: 'time',
          };

          const baseName = map[route.name] ?? 'ellipse';
          const iconName = focused ? baseName : `${baseName}-outline`;
          // Slightly larger icon for better tap targets
          return <Icon name={iconName} size={24} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={({navigation}) => ({
          title: 'Cart',
          // use a custom tabBarButton to get floating elevated center button
          tabBarButton: props => (
            <FloatingCartButton
              onPress={props.onPress}
              // optional: open a modal or navigate conditionally
            >
              <Icon name="cart" size={26} color="#fff" />
            </FloatingCartButton>
          ),
        })}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Account',
        }}
      />

      <Tab.Screen
        name="Chats"
        component={AllChatScreen}
        options={{
          title: 'Chats',
          // Example badge — in real app set programmatically
          // tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          // tabBarBadgeStyle: { backgroundColor: '#E53935' },
        }}
      />

      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          title: 'Status',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 66,
    borderRadius: 16,
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    // Android elevation
    elevation: 12,
    paddingHorizontal: 10,
    // Keep tab items vertically centered
    paddingTop: 6,
  },
  floatingButtonContainer: {
    top: Platform.OS === 'android' ? -26 : -30, // lift above tab bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    width: 62,
    height: 62,
    borderRadius: 62 / 2,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.12,
    shadowRadius: 20,
    // Android elevation
    elevation: 10,
  },
});

export default MainTabsNavigator;

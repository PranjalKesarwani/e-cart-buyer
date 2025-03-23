// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AllChatScreen from '../screens/AllChatScreen';
// import StatusScreen from '../screens/StatusScreen';

// export type MainTabsParamList = {
//   Chats: undefined;
//   Status: undefined;
// };

// const Tab = createBottomTabNavigator<MainTabsParamList>();

// const MainTabsNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#25D366',
//         tabBarInactiveTintColor: '#667781',
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           borderTopWidth: 0,
//           elevation: 8,
//         },
//         headerShown: false,
//       }}>
//       <Tab.Screen
//         name="Chats"
//         component={AllChatScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Icon name="chatbubbles-outline" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Status"
//         component={StatusScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Icon name="time-outline" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default MainTabsNavigator;

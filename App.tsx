import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView } from 'react-native';
import { RootStackParamList } from './src/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screens
import SplashScreen from './src/screens/SpalshScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();



function App(): React.JSX.Element {
  return (

    <SafeAreaProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='SplashScreen'>
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
            name='HomeScreen'
            component={HomeScreen}
            options={
              {
                title: "Home Screen"
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

        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaProvider>
  );
}

export default App;

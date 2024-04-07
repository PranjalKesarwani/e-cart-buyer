import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator<RootStackParamList>();



function App(): React.JSX.Element {
  return (

    <SafeAreaProvider>

      <NavigationContainer>

        <AppNavigator/>

      </NavigationContainer>

    </SafeAreaProvider>
  );
}

export default App;

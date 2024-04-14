import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createNativeStackNavigator<RootStackParamList>();



function App(): React.JSX.Element {
  return (

    <GestureHandlerRootView>


      <SafeAreaProvider>

        <NavigationContainer>

          <AppNavigator />

        </NavigationContainer>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

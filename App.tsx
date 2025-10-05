import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {RootStackParamList} from './src/types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {store} from './src/redux/store';
import {navigationRef} from './src/navigation/navigationService';
import {useAppDispatch} from './src/redux/hooks';
import socket from './src/utils/socket';
import {setSocketId} from './src/redux/slices/chatSlice';

function MainApp(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This listener will fire when the socket receives the 'connected' event from the backend
    socket.on('connected', payload => {
      console.log('Successfully connected to the server!');
      console.log('My socket ID is:', payload.socketId);
      dispatch(setSocketId(payload.socketId));
    });

    // Optional: Clean up the listener when the component unmounts
    return () => {
      socket.off('connected');
    };
  }, [dispatch]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

export default App;

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('hello duniya'); // Log a message after 2 seconds
      navigation.navigate('LoginScreen'); // Navigate to a screen that exists in your navigation stack
    }, 2000);

    return () => clearTimeout(timer); // Clear the timeout when component unmounts
  }, [navigation]);

  return (
    <View>
      <Text>hii world</Text>
    </View>
  );
};

export default SplashScreen;

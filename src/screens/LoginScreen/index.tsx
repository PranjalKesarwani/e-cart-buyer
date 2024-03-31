import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Hello this is login screen
      </Text>
    </View>
  );
};

export default LoginScreen;

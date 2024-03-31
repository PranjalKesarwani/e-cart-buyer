import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    // Call API for authentication and navigate accordingly
    // For demo, navigate to OTPScreen directly
    navigation.navigate('OTPScreen');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Submit" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

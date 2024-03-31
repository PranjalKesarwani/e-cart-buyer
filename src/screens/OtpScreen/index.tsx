import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const OTPScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [otp, setOTP] = useState('');

  const handleOTPSubmit = () => {
    // Call API to verify OTP
    // For demo, navigate to HomeScreen directly
    navigation.navigate('HomeScreen');
  };

  return (
    <View >
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOTP}
      />
      <Button title="Submit" onPress={handleOTPSubmit} />
    </View>
  );
};

export default OTPScreen;

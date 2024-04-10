import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Title from '../../components/Title';

type OtpProps = NativeStackScreenProps<RootStackParamList, "LoginScreen">;

const LoginScreen = ({ navigation }: OtpProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = () => {
    navigation.replace('OtpScreen', { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.appTitle}>
      <Title fontSize={36} fontWeight={'bold'} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP to this mobile number</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center', // Center elements vertically
  },
  appTitle: {
   alignItems:"center",
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    marginTop:30
  },
  button: {
    backgroundColor: '#4CAF50', // Green color
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;

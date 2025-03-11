import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Title from '../../components/Title';
import axios from 'axios';
import {API_URL} from '../../config';
import {apiClient, request} from '../../services/api';
import {showToast} from '../../utils/toast';

type OtpProps = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

const LoginScreen = ({navigation}: OtpProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = async () => {
    try {
      console.log('ldksflksdfkl');
      const res = await apiClient.post('/buyer/send-otp', {
        mobile: phoneNumber,
      });
      console.log('------>>>', res.data);

      if (!res.data.success) throw new Error(res?.data.message);
      if (res.data.success) {
        showToast(
          'success',
          'OTP Sent Successfully!',
          'Otp has been sent to your mobile number!',
        );
        navigation.replace('OtpScreen', {phoneNumber});
      }

      console.log('---------', res?.data.message);
    } catch (error: any) {
      console.log('error', error);
      showToast('error', 'Error', error.message);
    }
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
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 30,
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

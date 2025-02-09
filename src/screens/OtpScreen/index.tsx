import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {RootStackParamList} from '../../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Title from '../../components/Title';
import {request} from '../../services/api';
import {showToast} from '../../utils/toast';

type OtpProps = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;

const OTPScreen = ({route}: OtpProps) => {
  const {phoneNumber} = route.params;
  const navigation = useNavigation<any>();
  const [otp, setOTP] = useState<Array<string | undefined>>(
    Array(6).fill(undefined),
  );
  const refs = useRef<Array<TextInput | null>>(Array(6).fill(null));

  const handleOTPChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      // Move focus to the next input field
      refs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && !otp[index]) {
      // Move focus to the previous input field
      refs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await request('POST', '/auth/verify-otp', {
        mobile: phoneNumber,
        otp,
      });
      if (res.data.success) {
        console.log('OTP verified');
        showToast('success', 'OTP Verified Successfully!', '');
        navigation.navigate('NameInfoScreen');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Title fontSize={36} fontWeight={'bold'} />
      <Text style={styles.text}>Enter OTP sent to {phoneNumber}</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={value => handleOTPChange(index, value)}
            ref={input => (refs.current[index] = input)}
            onFocus={() => refs.current[index]?.setSelection(0, 1)}
            onKeyPress={({nativeEvent}) =>
              nativeEvent.key === 'Backspace' && handleBackspace(index)
            }
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleSendOtp()} style={styles.button}>
          <Text style={styles.buttonText}>SUBMIT OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('NameInfoScreen')}
          style={styles.button}>
          <Text style={styles.buttonText}>New user: Go NameInfoScreen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('DrawerNavigator')}
          style={styles.button}>
          <Text style={styles.buttonText}>Old user: Go to HomeScreen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    gap: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 41,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff', // Example button color
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // Example text color
    textAlign: 'center',
  },
});

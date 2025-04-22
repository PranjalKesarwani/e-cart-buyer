import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import Title from '../../components/Title';

type OtpProps = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

const LoginScreen = ({navigation}: OtpProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const scaleValue = new Animated.Value(1);
  const translateYValue = new Animated.Value(0);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      showToast('error', 'Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post('/buyer/send-otp', {
        mobile: phoneNumber,
      });

      if (res.data.success) {
        showToast(
          'success',
          'OTP Sent Successfully!',
          'OTP has been sent to your mobile number',
        );
        navigation.replace('OtpScreen', {phoneNumber});
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send OTP';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View
        style={[styles.content, {transform: [{translateY: translateYValue}]}]}>
        <View style={styles.header}>
          <Title fontSize={42} fontWeight="800" />
          <Text style={styles.subtitle}>Login with your mobile number</Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            inputFocused && styles.inputContainerFocused,
          ]}>
          <Icons
            name="phone-android"
            size={24}
            color={inputFocused ? Theme.colors.primary : Theme.colors.gray}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={Theme.colors.gray}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            onFocus={() => {
              setInputFocused(true);
              Animated.timing(translateYValue, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }}
            onBlur={() => {
              setInputFocused(false);
              Animated.timing(translateYValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }}
            maxLength={15}
          />
        </View>

        <Animated.View style={{transform: [{scale: scaleValue}]}}>
          <TouchableOpacity
            style={[
              styles.button,
              (!phoneNumber || isLoading) && styles.buttonDisabled,
            ]}
            onPressIn={animateButton}
            onPress={handleSendOTP}
            disabled={!phoneNumber || isLoading}
            activeOpacity={0.9}>
            {isLoading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>
          We'll send an OTP to verify your number
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 18,
    color: Theme.colors.gray,
    marginTop: 10,
    fontFamily: Theme.fonts.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.lightBackground,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
  },
  inputContainerFocused: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.white,
    shadowColor: Theme.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 16,
    color: Theme.colors.darkText,
    fontFamily: Theme.fonts.body,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: Theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
  },
  footerText: {
    textAlign: 'center',
    color: Theme.colors.gray,
    fontSize: 12,
    marginTop: 30,
    fontFamily: Theme.fonts.body,
    lineHeight: 18,
  },
});

export default LoginScreen;

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RootStackParamList} from '../../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Title from '../../components/Title';
import {apiClient} from '../../services/api';
import {showToast} from '../../utils/toast';
import {setBuyToken} from '../../utils/helper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../theme/theme';

type OtpProps = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;

const OTPScreen = ({route}: OtpProps) => {
  const {phoneNumber} = route.params;
  const navigation = useNavigation<any>();
  const [otp, setOTP] = useState<Array<string | undefined>>(
    Array(6).fill(undefined),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>(Array(6).fill(null));
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

  const handleOTPChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && !otp[index]) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (otp.join('').length !== 6) {
      showToast('error', 'Please enter complete OTP');
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post('/buyer/verify-otp', {
        mobile: phoneNumber,
        otp: otp.join(''),
      });

      if (res.data.success) {
        setBuyToken(res.data.buyerToken);
        showToast('success', 'Success!', 'OTP Verified Successfully!');
        navigation.navigate('DrawerNavigator');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Verification failed';
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
          <Icons
            name="lock-outline"
            size={32}
            color={Theme.colors.primary}
            style={styles.lockIcon}
          />
          <Text style={styles.subtitle}>Verification Code</Text>
          <Text style={styles.phoneText}>Sent to {phoneNumber}</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.input,
                focusedIndex === index && styles.inputFocused,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={value => handleOTPChange(index, value)}
              ref={input => (refs.current[index] = input)}
              onFocus={() => {
                setFocusedIndex(index);
                Animated.timing(translateYValue, {
                  toValue: -50,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }}
              onBlur={() => {
                setFocusedIndex(null);
                Animated.timing(translateYValue, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }}
              onKeyPress={({nativeEvent}) =>
                nativeEvent.key === 'Backspace' && handleBackspace(index)
              }
              selectionColor={Theme.colors.primary}
            />
          ))}
        </View>

        <Animated.View style={{transform: [{scale: scaleValue}]}}>
          <TouchableOpacity
            style={[
              styles.button,
              (otp.join('').length !== 6 || isLoading) && styles.buttonDisabled,
            ]}
            onPressIn={animateButton}
            onPress={handleSendOtp}
            disabled={otp.join('').length !== 6 || isLoading}
            activeOpacity={0.9}>
            {isLoading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>VERIFY OTP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>
          Didn't receive code? <Text style={styles.resendText}>Resend OTP</Text>
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
    marginBottom: 40,
  },
  lockIcon: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 22,
    color: Theme.colors.darkText,
    fontFamily: Theme.fonts.heading,
    marginBottom: 8,
  },
  phoneText: {
    fontSize: 16,
    color: Theme.colors.gray,
    fontFamily: Theme.fonts.body,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: Theme.colors.lightBackground,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    fontSize: 20,
    color: Theme.colors.darkText,
    textAlign: 'center',
    fontFamily: Theme.fonts.heading,
  },
  inputFocused: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.white,
    shadowColor: Theme.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    color: Theme.colors.gray,
    fontSize: 14,
    marginTop: 30,
    fontFamily: Theme.fonts.body,
  },
  resendText: {
    color: Theme.colors.primary,
    fontFamily: Theme.fonts.heading,
  },
});

export default OTPScreen;

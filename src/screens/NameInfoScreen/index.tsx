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
import {navigate} from '../../navigation/navigationService';

type NameInfoProps = NativeStackScreenProps<
  RootStackParamList,
  'NameInfoScreen'
>;

const NameInfoScreen = ({navigation}: NameInfoProps) => {
  const [name, setName] = useState('');
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast('error', 'Please enter your name');
      return;
    }

    if (name.length < 3) {
      showToast('error', 'Name must be at least 3 characters');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.patch('/buyer/update-buyer-info', {
        name,
      });

      if (response.data.success) {
        showToast('success', 'Profile updated successfully!');
        // navigation.replace('DrawerNavigator');
        navigate('MainTabsNavigator');
      } else {
        showToast(response.data.message || 'Update failed', 'error');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      showToast(errorMessage, 'error');
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
          <Title />
          <Text style={styles.subtitle}>Let's get to know you</Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            inputFocused && styles.inputContainerFocused,
          ]}>
          <Icons
            name="person-outline"
            size={24}
            color={inputFocused ? Theme.colors.primary : Theme.colors.gray}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor={Theme.colors.gray}
            value={name}
            onChangeText={setName}
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
            autoCapitalize="words"
            returnKeyType="done"
            maxLength={40}
          />
        </View>

        <Animated.View style={{transform: [{scale: scaleValue}]}}>
          <TouchableOpacity
            style={[
              styles.button,
              (!name || isLoading) && styles.buttonDisabled,
            ]}
            onPressIn={animateButton}
            onPress={handleSubmit}
            disabled={!name || isLoading}
            activeOpacity={0.9}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
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
    fontWeight: '600',
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

export default NameInfoScreen;

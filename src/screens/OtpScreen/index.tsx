import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type OtpProps = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;

const OTPScreen = ({ route }: OtpProps) => {
  const { phoneNumber } = route.params;
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>OTP: {phoneNumber}</Text>
      <View style={styles.buttonContainer}>
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

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen = ({ navigation }: PaymentScreenProps) => {


  const handlePaymentOptionPress = () => {
    // Handle navigation to OrderStatusScreen with the selected payment option
    navigation.navigate('OrderStatusScreen');
  };

  // Generate array of 10 payment options
  const paymentOptions = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      {/* Back button with text Back and left arrow icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icons name="left" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* List of payment options */}
      <ScrollView contentContainerStyle={styles.paymentOptionsContainer}>
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handlePaymentOptionPress()}
            style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Payment option {option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
  },
  paymentOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOption: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  paymentOptionText: {
    color: 'white',
    fontSize: 18,
  },
});

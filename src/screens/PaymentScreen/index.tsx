import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';

type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen = ({ navigation }: PaymentScreenProps) => {

  const handlePaymentOptionPress = (option: number) => {
    // Handle navigation to OrderStatusScreen with the selected payment option
    navigation.navigate('OrderStatusScreen');
  };

  const handlePlaceOrderPress = () => {
    navigation.navigate("OrderStatusScreen")
    // Handle placing the order
  };

  // Sample payment options data
  const paymentOptions = [
    {
      id: 1,
      name: "Credit Card",
      image: require("../../assets/images/credit_card.jpg"),
    },
    {
      id: 2,
      name: "PayPal",
      image: require("../../assets/images/g_pay.jpg"),
    },
    {
      id: 3,
      name: "Google Pay",
      image: require("../../assets/images/pay_pal.jpg"),
    },
    {
      id: 4,
      name: "Apple Pay",
      image: require("../../assets/images/apple_pay.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons name="left" size={24} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Options</Text>
      </View>

      {/* List of payment options */}
      <ScrollView contentContainerStyle={styles.paymentOptionsContainer}>
        {paymentOptions.map((option) => (
          <View key={option.id} style={styles.paymentOption}>
            <Image source={option.image} style={styles.paymentOptionImage} />
            <Text style={styles.paymentOptionName}>{option.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Place Order button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrderPress}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  paymentOptionsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 70, // Adjusted to accommodate the Place Order button
  },
  paymentOption: {
    backgroundColor: '#fff',
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    alignSelf: 'center',
  },
  paymentOptionImage: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  paymentOptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  placeOrderButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

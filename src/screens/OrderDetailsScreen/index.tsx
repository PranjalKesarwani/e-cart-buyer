import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';

type OrderDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "OrderDetailsScreen">;

const OrderDetailsScreen = ({ navigation }: OrderDetailsScreenProps) => {
  const items = [
    { name: 'Item 1', qty: 1, itemPrice: '$100', totalPrice: '$100' },
    { name: 'Item 2', qty: 2, itemPrice: '$200', totalPrice: '$400' },
    { name: 'Item 3', qty: 1, itemPrice: '$150', totalPrice: '$150' },
    { name: 'Item 4', qty: 3, itemPrice: '$300', totalPrice: '$900' },
  ];
  const totalPrice = '$1550'; // Dummy total price

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons name="left" size={20} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Prakash Watch Center</Text>
      </View>

      <Text style={styles.orderDetailsText}>Your Order Details</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Item</Text>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Amount</Text>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableRowText}>{item.name}</Text>
            <Text style={styles.tableRowText}>{item.qty}</Text>
            <Text style={styles.tableRowText}>{item.itemPrice}</Text>
            <Text style={styles.tableRowText}>{item.totalPrice}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Final Amount</Text>
          <Text style={styles.totalPrice}>{totalPrice}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.proceedButton} onPress={()=>navigation.navigate("AddressScreen")} >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  orderDetailsText: {
    fontSize: 18,
    marginBottom: 20,
  },
  tableContainer: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableRowText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

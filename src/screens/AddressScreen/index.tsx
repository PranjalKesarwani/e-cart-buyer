import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import { RootStackParamList } from '../../types';

type AddressScreenProps = NativeStackScreenProps<RootStackParamList, "AddressScreen">;

const AddressScreen = ({ navigation }: AddressScreenProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressName: '',
    phone: '',
    customerName: '',
    alternatePhone: '',
    landmark: ''
  });

  const handleAddAddress = () => {
    // Handle adding a new address
    setModalVisible(false);
  };

  const addresses = Array.from({ length: 20 }, (_, i) => `Address ${i + 1}`);

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons name="left" size={20} color={'black'} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Address</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {addresses.map((address, index) => (
          <View key={index} style={styles.addressCard}>
            <TouchableOpacity onPress={()=>navigation.navigate("PaymentScreen")} >

              <Text>{address}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>Add New Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address Name"
              value={newAddress.addressName}
              onChangeText={(text) => setNewAddress({ ...newAddress, addressName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newAddress.phone}
              onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={newAddress.customerName}
              onChangeText={(text) => setNewAddress({ ...newAddress, customerName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Alternate Phone Number"
              value={newAddress.alternatePhone}
              onChangeText={(text) => setNewAddress({ ...newAddress, alternatePhone: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Landmark"
              value={newAddress.landmark}
              onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddAddress}>
              <Text style={styles.modalButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 60, // Adjust this value to avoid overlap with the button
  },
  addressCard: {
    width: '95%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    width: '95%',
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

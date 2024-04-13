import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, PermissionsAndroid, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { RootDrawerParamList } from '../../types'; // Assuming you only need RootDrawerParamList
import Icons from 'react-native-vector-icons/AntDesign'
import Icons2 from 'react-native-vector-icons/Entypo'

type HomeProps = NativeStackScreenProps<RootDrawerParamList, "HomeScreen">;

const HomeScreen = ({ navigation }: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const modalHeight = windowHeight;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icons2 name="chevron-down" size={50} color={'red'} />
          <Text style={styles.headerText}>Sahson</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* Your main content here */}
        <Button
          title='Go to ShopList Screen please'
          onPress={() => navigation.navigate("ShopListScreen")}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[styles.modalView, { height: modalHeight }]}>
          <Text>This is a modal sheet!</Text>
          <Button
            title="Close"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 'auto',
  },
});

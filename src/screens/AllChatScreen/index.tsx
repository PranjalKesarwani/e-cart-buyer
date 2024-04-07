import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';
import { TouchableOpacity } from 'react-native-gesture-handler';

type AllChatScreenProps = NativeStackScreenProps<RootStackParamList, "AllChatScreen">



const AllChatScreen = ({ navigation }: AllChatScreenProps) => {

    return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NameInfoScreen')}
            style={styles.button}>
            <Text style={styles.buttonText}>Go to wish list screen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('DrawerNavigator')}
            style={styles.button}>
            <Text style={styles.buttonText}>Go to Cart Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('DrawerNavigator')}
            style={styles.button}>
            <Text style={styles.buttonText}>Chat to Owner</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default AllChatScreen;

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

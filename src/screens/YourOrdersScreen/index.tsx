import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';
import { TouchableOpacity } from 'react-native-gesture-handler';

type YourOrdersScreenProps = NativeStackScreenProps<RootStackParamList, "YourOrdersScreen">



const YourOrdersScreen = ({ navigation }: YourOrdersScreenProps) => {

    return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <Text>Your Orders</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('DrawerNavigator')}
            style={styles.button}>
            <Text style={styles.buttonText}>Go to Home screen</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
};

export default YourOrdersScreen;

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

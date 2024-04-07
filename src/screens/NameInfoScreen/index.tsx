
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';

type NameInfoProps = NativeStackScreenProps<RootStackParamList, "NameInfoScreen">

const NameInfoScreen= ({navigation}:NameInfoProps) => {



return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
     
      />
      <Button
      title='Go to Home Screen'
      onPress={()=>navigation.navigate("DrawerNavigator")}
      />
    </View>
  );
  
};

export default NameInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
    padding: 10, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
  },
});

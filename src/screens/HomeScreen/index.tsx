import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, "HomeScreen">


const HomeScreen = ({navigation}:HomeProps) => {
  
  return (
    <View style={styles.container} >
      <Text>Welcome to Home Screen!</Text>
   
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  
  }
})

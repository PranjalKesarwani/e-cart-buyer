import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootStackParamList } from '../../types';

type HomeProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">


const HomeScreen = ({navigation}:HomeProps) => {
  return (
    <View style={styles.container} >
      <Text>Welcome to Home Screen!</Text>
      <Button 
      title='User authenticated successfully'
      onPress={()=>navigation.navigate("LoginScreen")}
      />
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

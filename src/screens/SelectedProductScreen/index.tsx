import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootStackParamList } from '../../types';

type SelectedProductScreen = NativeStackScreenProps<RootStackParamList, "SelectedProductScreen">


const SelectedProductScreen = ({navigation}:SelectedProductScreen) => {
  
  return (
    <View style={styles.container} >
      <Text>Prakash Watch Center</Text>
      <Button 
      title='User authenticated successfully'
      onPress={()=>navigation.navigate("LoginScreen")}
      />
    </View>
  );
};

export default SelectedProductScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  
  }
})

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootStackParamList } from '../../types';

type ShopsProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">


const ShopsScreen = ({navigation}:ShopsProps) => {
  
  return (
    <View style={styles.container} >
      <Text>Welcome to List of shops Screen!</Text>
      <Button 
      title='User authenticated successfully'
      onPress={()=>navigation.navigate("LoginScreen")}
      />
    </View>
  );
};

export default ShopsScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  
  }
})

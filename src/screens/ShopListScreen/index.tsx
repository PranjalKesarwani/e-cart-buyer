import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';

type ShopListProps = NativeStackScreenProps<RootStackParamList, "ShopListScreen">



const ShopListScreen = ({navigation}:ShopListProps) => {
  
  return (
    <View style={styles.container} >
      <View style={styles.textContainer} >

      <Text style={styles.textStyle}>Shops list of particular category</Text>
      <Text style={styles.textStyle}>e.g. Shoes</Text>
      </View>
   
    </View>
  );
};

export default ShopListScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  
  },
  textContainer:{
    width:250,
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    textAlign:"center"
  },
  textStyle:{
    fontSize:20,
    textAlign:"center"
  }
})

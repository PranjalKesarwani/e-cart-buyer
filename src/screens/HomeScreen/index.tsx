import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, "HomeScreen">



const HomeScreen = ({navigation}:HomeProps) => {
  
  return (
    <View style={styles.container} >
      <View style={styles.textContainer} >

      <Text style={styles.textStyle}>List of shop Categories + Importat Contacts</Text>
      <Text style={styles.textStyle}>e.g. Shoes, Watch, Cloth, Mats + Contacts of Potters, Kabadi waale, R.O. , AC, Electrician</Text>
      </View>
   
    </View>
  );
};

export default HomeScreen;

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

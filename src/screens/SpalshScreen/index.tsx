import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Title from '../../components/Title';

type SplashProps = NativeStackScreenProps<RootStackParamList, "SplashScreen">

const SplashScreen = ({ navigation }: SplashProps) => {

  const [isAuth,setIsAuth] = useState<boolean>(false);

  setTimeout(()=>{
    if(!isAuth)return navigation.replace("LoginScreen");
    navigation.replace("DrawerNavigator")

  },3000)

  const titleSizeDetails = {
    fontSize: 36,
    fontWeight: 'bold'
  }

  return (
    <View style={styles.container}>
    <Title  fontSize={36} fontWeight={"bold"} />
    <Text style={styles.subtitle}>Authenticating User...</Text>
  </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Background color chosen for the screen
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
});

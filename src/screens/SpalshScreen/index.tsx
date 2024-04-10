import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type SplashProps = NativeStackScreenProps<RootStackParamList, "SplashScreen">

const SplashScreen = ({ navigation }: SplashProps) => {

  const [isAuth,setIsAuth] = useState<boolean>(true);

  setTimeout(()=>{
    if(!isAuth)return navigation.replace("LoginScreen");
    navigation.replace("DrawerNavigator")

  },3000)


  return (
    <View style={styles.container}>
      <Text>Amazex (Ek sheher ek dukaan)</Text>
      <Text>Authenticating User...</Text>
     {/* <Button
      title='Go to home screen'
    //  onPress={()=>navigation.navigate("OtpScreen",{otp:7856})}
    // onPress={()=>navigation.navigate("HomeScreen")}
    // onPress={ ()=>{navigation.push("OtpScreen",{
    //   otp:8878
    // })}}

     /> */}
   
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: "center",
    justifyContent:"center"

  }
})

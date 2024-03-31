import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type SplashProps = NativeStackScreenProps<RootStackParamList, "SplashScreen">

const SplashScreen = ({ navigation }: SplashProps) => {


  return (
    <View style={styles.container}>
      <Text>hii pranjal</Text>
     <Button
      title='Go to home screen'
    //  onPress={()=>navigation.navigate("OtpScreen",{otp:7856})}
    onPress={()=>navigation.navigate("HomeScreen")}
    // onPress={ ()=>{navigation.push("OtpScreen",{
    //   otp:8878
    // })}}

     />
   
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

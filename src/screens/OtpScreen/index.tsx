import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OtpProps = NativeStackScreenProps<RootStackParamList, "OtpScreen">

const OTPScreen= ({route}:OtpProps) => {

  const {phoneNumber}  = route.params;

const navigation =  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container} >


      <Text style={styles.container}>
        OTP: {phoneNumber}
      
  
      </Text>
      <Button
        title='Go to name info screen'
        onPress={()=>navigation.replace("NameInfoScreen")}
        />
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
    padding: 10, 
  },
});

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
    <View >
      <Text style={styles.container}>
        OTP: {phoneNumber}
        <Button
        title='Go to home screen via go back method'
        onPress={()=>navigation.goBack()}
        />
          <Button
        title='Go to home screen via pop method'
        onPress={()=>navigation.popToTop()}
        />
      </Text>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"

  }
})

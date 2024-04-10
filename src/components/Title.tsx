import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type TitleProps = {

    fontSize:number;
    fontWeight: any;
    
}

const Title = ({fontSize,fontWeight}:TitleProps) => {




  return (
    <Text style={{ fontSize: fontSize, fontWeight: fontWeight }}>
      <Text style={styles.red}>A</Text>
      <Text style={styles.orange}>m</Text>
      <Text style={styles.yellow}>a</Text>
      <Text style={styles.green}>z</Text>
      <Text style={styles.blue}>e</Text>
      <Text style={styles.indigo}>X</Text>
    </Text>
 
  );
};

export default Title;

const styles = StyleSheet.create({
 
  title: {
    fontSize: 36, // Larger fontsize for the app's name
    fontWeight: 'bold', // Good fontweight for the app's name
  },
  red: {
    color: '#E72929', // Red color
  },
  orange: {
    color: '#FC6736', // Orange color
  },
  yellow: {
    color: '#FFC94A', // Yellow color
  },
  green: {
    color: '#87A922', // Green color
  },
  blue: {
    color: '#0000ff', // Blue color
  },
  indigo: {
    color: '#4b0082', // Indigo color
  },

});

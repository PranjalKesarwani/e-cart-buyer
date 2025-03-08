import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type TitleProps = {
  fontSize: number;
  fontWeight: any;
};

const Title = ({fontSize, fontWeight}: TitleProps) => {
  return (
    // <Text style={{fontSize: fontSize, fontWeight: fontWeight}}>
    //   <Text style={styles.red}>B</Text>
    //   <Text style={styles.orange}>o</Text>
    //   <Text style={styles.yellow}>l</Text>
    //   <Text style={styles.green}>t</Text>
    //   <Text style={styles.blue}>i</Text>
    //   <Text style={styles.indigo}>X</Text>
    // </Text>
    <Image
      source={require('../../src/assets/images/boltix.png')} // Replace with your actual image path
      style={styles.image}
      resizeMode="contain"
    />
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
  image: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    // marginTop: 20,
  },
});

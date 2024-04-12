import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, PermissionsAndroid } from 'react-native';
import { RootDrawerParamList } from '../../types'; // Assuming you only need RootDrawerParamList
import MapView from 'react-native-maps';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, "HomeScreen">;

const HomeScreen = ({ navigation }: HomeProps) => {






  return (
    <View style={styles.container} >
      <View style={styles.textContainer} >
      
        <Button
          title='Go to ShopList Screen'
          onPress={() => navigation.navigate("ShopListScreen")}
        />
    
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    width: 250,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center"
  }
});

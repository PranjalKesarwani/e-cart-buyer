import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Title from '../../components/Title';

type NameInfoProps = NativeStackScreenProps<RootStackParamList, "NameInfoScreen">

const NameInfoScreen= ({ navigation }: NameInfoProps) => {

  return (
    <View style={styles.container}>
      <Title fontSize={36} fontWeight={"bold"} />
      <Text style={styles.subtitle}>Please Enter Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
      />
      <Button
        title='Submit Name'
        onPress={() => navigation.navigate("DrawerNavigator")}
      />
     
    </View>
  );
};

export default NameInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';

type OrderStatusScreenProps = NativeStackScreenProps<RootStackParamList, "OrderStatusScreen">;

const OrderStatusScreen = ({ navigation }: OrderStatusScreenProps) => {

    return (
        <View style={styles.container}>
            <Text style={styles.thanksText}>Thanks for shopping! 😊</Text>
            <View style={styles.content}>
                <Icons name="checkcircle" size={100} color="green" />
                <Text style={styles.text}>Order placed successfully!</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("DrawerNavigator", { screen: "HomeScreen" })}
                    style={styles.button}>
                    <Icons name="home" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    thanksText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'lightgrey',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

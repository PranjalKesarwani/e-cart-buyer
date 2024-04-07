import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootDrawerParamList, RootStackParamList } from '../../types';

type ShopScreenProps = NativeStackScreenProps<RootStackParamList, "ShopScreen">



const ShopScreen = ({ navigation }: ShopScreenProps) => {

    return (
        <View style={styles.container} >
            <View style={styles.textContainer} >

                <Text style={styles.textStyle}>Selected Shoe(say) shop</Text>
                <Text style={styles.textStyle}>e.g. Shoes</Text>
                <Button
                    title='Go to Product Screen'
                    onPress={() => navigation.navigate("ProductScreen")}
                />
            </View>

        </View>
    );
};

export default ShopScreen;

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
})

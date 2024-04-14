import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, Button, PermissionsAndroid } from 'react-native';
import { RootStackParamList } from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import Title from '../../components/Title';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';


type ShopListProps = NativeStackScreenProps<RootStackParamList, "ShopListScreen">;

const ShopListScreen = ({ navigation }: ShopListProps) => {
    // Sample data for shops (replace it with your actual data)



    const shops = [
        { id: 1, name: 'Shop 1' },
        { id: 2, name: 'Shop 2' },
        { id: 3, name: 'Shop 3' },
        { id: 4, name: 'Shop 4' },
        { id: 5, name: 'Shop 5' },
        { id: 6, name: 'Shop 6' },
        { id: 7, name: 'Shop 7' },
        { id: 8, name: 'Shop 8' },
        { id: 9, name: 'Shop 9' },
        { id: 10, name: 'Shop 10' },
        { id: 11, name: 'Shop 10' },
        { id: 12, name: 'Shop 10' },
        { id: 13, name: 'Shop 10' },
        { id: 14, name: 'Shop 10' },
    ];

    // Function to navigate to shop details screen
    const goToShopScreen = () => {
        // Navigate to the shop details screen, replace "ShopScreen" with your actual screen name
        navigation.navigate("ShopScreen");
    };

    // Render shop card
    const renderShopCard = ({ item }: { item: { id: number; name: string } }) => (
        <TouchableOpacity style={styles.shopCard} onPress={goToShopScreen}>
            <Text style={styles.shopName}>{item.name}</Text>
        </TouchableOpacity>
    );




    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icons name="left" size={17} color={'black'} />
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.header}>

                <View style={styles.touchable}>
                    <View style={{ flexDirection: "row", width: "58%" }}>

                        <View>
                            <Text style={styles.headerText}>Sahson</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subHeaderText}>Opposite Ramleela maidan, 221507</Text>
                        </View>
                    </View>
                    <View style={{ width: "42%", flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Title fontSize={23} fontWeight={"bold"} />
                    </View>
                </View>

            </View>

            {/* Shop list */}
            <View style={styles.shopListContainer}>
                <FlatList
                    data={shops}
                    renderItem={renderShopCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                />
            </View>
          
        </View>
    );
};

export default ShopListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,

    },
    header: {
        padding: 20,

        width: "100%"
    },
    navContainer: {
        width: '100%',
    },
    backButton: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopListContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
        width: '100%',
    },
    shopCard: {
        flex: 1,
        margin: 10,
        padding: 20,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10, // Adjust as needed
        paddingVertical: 5, // Adjust as needed
        borderRadius: 5, // Example border radius
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 3
    },
    subHeaderText: {
        fontSize: 12
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 'auto',
    },
});

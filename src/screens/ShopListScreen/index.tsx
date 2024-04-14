import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import Title from '../../components/Title';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';


type ShopListProps = NativeStackScreenProps<RootStackParamList, "ShopListScreen">;

const ShopListScreen = ({ navigation }:ShopListProps) => {
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
        { id: 11, name: 'Shop 11' },
        { id: 12, name: 'Shop 12' },
        { id: 13, name: 'Shop 13' },
        { id: 14, name: 'Shop 14' },
    ];

    const goToShopScreen = () => {
        navigation.navigate("ShopScreen");
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.navContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icons name="left" size={17} color={'black'} />
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
            <ScrollView stickyHeaderIndices={[1]}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.touchable}>
                            <View style={{ flexDirection: "row", width: "58%" }}>
                                <View>
                                    <Text style={styles.headerText}>Sahson</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subHeaderText}>Opposite Ramleela maidan, 221507</Text>
                                </View>
                            </View>
                            <View style={{ width: "42%", flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Title fontSize={28} fontWeight={"bold"}/>
                            </View>
                        </View>
                    </View>
                    <View><Text style={{fontSize:20}}>Category: Watch & Gifts</Text></View>
                    <View style={styles.shopListContainer}>
                        {shops.map((shop, index) => (
                            <TouchableOpacity key={index} style={styles.shopCard} onPress={goToShopScreen}>
                                <Text style={styles.shopName}>{shop.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ShopListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    header: {
        padding: 20,
        width: "100%",
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
        flexDirection: "row",
        flexWrap: "wrap",
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    shopCard: {
        margin: 6,
        padding: 20,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: "45%",
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 3,
    },
    subHeaderText: {
        fontSize: 12,
    },
});

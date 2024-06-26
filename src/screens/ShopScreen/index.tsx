import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RootStackParamList } from '../../types';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/AntDesign';

type ShopScreenProps = NativeStackScreenProps<RootStackParamList, "ShopScreen">



const ShopScreen = ({ navigation }: ShopScreenProps) => {

    const shops = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
        { id: 9, name: 'Item 9' },
        { id: 10, name: 'Item 10' },
        { id: 11, name: 'Item 11' },
        { id: 12, name: 'Item 12' },
        { id: 13, name: 'Item 13' },
        { id: 14, name: 'Item 14' },
    ];

    const goToProductScreen = () => {
        navigation.navigate("ProductScreen");
    };

    const [horizontalScrollOffset, setHorizontalScrollOffset] = useState(0);

    const handleHorizontalScroll = ({ event }: any) => {
        setHorizontalScrollOffset(event.nativeEvent.contentOffset.x);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.navContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icons name="left" size={17} color={'black'} />
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
            <ScrollView stickyHeaderIndices={[1]} >
                <View style={styles.container}>
                    <View>
                        <Text style={styles.textStyle} >Prakash Watch Center</Text>
                        <Text style={styles.textStyle} >Mon-Sun(10am - 9pm)</Text>
                        <Text style={styles.textStyle} >Address: Sahson, Opp. Ram Janaki Mandir</Text>
                        <Text style={styles.textStyle} >Voice Message?</Text>
                    </View>

                    <Image
                        source={{ uri: "https://d27k8xmh3cuzik.cloudfront.net/wp-content/uploads/2018/03/street-shopping-in-india-cover.jpg" }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <View style={{ width: "90%" }}>
                        <ScrollView
                            horizontal
                            scrollEventThrottle={16}
                            style={styles.horizontalScrollView}
                        >
                            <View style={styles.catNav} ><Text>Item 1</Text></View>
                            <View style={styles.catNav} ><Text>Item 2</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                            <View style={styles.catNav} ><Text>Item 3</Text></View>
                        </ScrollView>
                    </View>



                    <View style={styles.shopListContainer}>
                        {shops.map((shop, index) => (
                            <TouchableOpacity key={index} style={styles.shopCard} onPress={goToProductScreen}>
                                <Text style={styles.shopName}>{shop.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ShopScreen;

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
        paddingHorizontal: 10,
        paddingTop: 20,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderColor: "black",
    },
    shopCard: {
        margin: 6,
        padding: 20,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 150,
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
    textStyle: {
        textAlign: "center"
    },
    catNav: {
        width: 70,
        height: 40,
        borderRadius: 7,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "orange",
    },
    horizontalScrollView: {
        flex: 1,
        marginTop: 20,
    },
    image:{
        width:"95%",
        height:200,
        marginTop:10
    }
});

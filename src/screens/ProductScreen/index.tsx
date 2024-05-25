import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import { Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type ProductScreenProps = NativeStackScreenProps<RootStackParamList, "ProductScreen">;

const ProductScreen = ({ navigation }: ProductScreenProps) => {
  const dimension = Dimensions.get('window').width;
  const imgArr = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcsyip4SRoev3sHck-kvsQr7QOvOy-V3TlOVXAsydu4pYJKOoOCIBUPoZFQMv8wSO-RYs&usqp=CAU",
    "https://target.scene7.com/is/image/Target/GUEST_b138b77e-5d2c-4d80-b264-87059549f298?wid=488&hei=488&fmt=pjpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tWSFv9V5stLQoAPcab_wYTG_DqVn97YhkQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSaFxc0DsmsospMssEpss9e_wkIBHonNtSYQ&s"
  ];

  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons name="left" size={17} color={'black'} />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Prakash Watch Center</Text>

        <View style={styles.imageContainerParent}>
          <Carousel
            loop
            width={dimension}
            height={500}
            autoPlay={true}
            data={imgArr}
            scrollAnimationDuration={1000}
            onSnapToItem={(index: number) => console.log('current index:', index)}
            renderItem={({ item }) => (
              <View>
                <Image source={{ uri: item }} style={styles.image} />
              </View>
            )}
          />
        </View>

        <View style={styles.chatBoxParent}>
          <View>
            <Text style={styles.chatBox1}>AmazeX watches</Text>
          </View>
          <View style={styles.chatBox}>
            <Icons name="message1" size={20} color={'black'} />
          </View>
        </View>

        <View style={styles.priceBox}>
          <Text>Price: 420$</Text>
          <Text>Description: Pure leather watches</Text>
        </View>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
          <Icons name="heart" size={30} color={isFavorite ? 'red' : 'grey'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    width: '100%',
  },
  backButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: '95%',
    height: 200,
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: 1,
  },
  chatBoxParent: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  chatBox1: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  chatBox: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E5E5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainerParent: {
    height: 220,
  },
  priceBox: {
    width: "100%",
    marginLeft: 15,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 20,
  },
  heartButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 50,
    padding: 10,
  },
  addToCartButton: {
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

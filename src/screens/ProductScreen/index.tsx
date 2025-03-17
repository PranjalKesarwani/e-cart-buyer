import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import {Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';

type ProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductScreen'
>;

const ProductScreen = ({route, navigation}: ProductScreenProps) => {
  const {product}: any = route.params;
  const dimension = Dimensions.get('window').width;
  const [isFavorite, setIsFavorite] = useState(false);
  const [subCats, setSubCats] = useState<any[]>([]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getSubCats = async () => {
    try {
      const res = await apiClient.get(
        `/buyer/shops/:shopId/categories/:categorySlug`,
      );
    } catch (error: any) {
      console.log(error);
      showToast('error', 'Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={17} color={'black'} />
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}>
          <Icons name="shoppingcart" size={24} color={'black'} />
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
            data={product.media.images as string[]}
            scrollAnimationDuration={1000}
            onSnapToItem={(index: number) =>
              console.log('current index:', index)
            }
            renderItem={({item}) => (
              <View>
                <Image source={{uri: item}} style={styles.image} />
              </View>
            )}
          />
        </View>

        <View style={styles.chatBoxParent}>
          <View>
            <Text style={styles.chatBox1}>{product.productName}</Text>
          </View>
          <View style={styles.chatBox}>
            <Icons name="message1" size={20} color={'black'} />
          </View>
        </View>

        <View style={styles.priceBox}>
          <Text>Price: {product.price + ' ' + product.currency}</Text>
          <Text>Description: Pure leather watches</Text>
        </View>
      </View>

      {/* <View style={{width: '90%'}}>
                  <FlatList
                    data={shopCats}
                    keyExtractor={item => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.catNav}
                        key={item._id}
                        onPress={() => getShopProducts(item)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View> */}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    padding: 10,
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
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '100%',
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
    textAlign: 'center',
  },
});

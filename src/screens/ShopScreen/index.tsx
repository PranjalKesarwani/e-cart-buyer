import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Category, Product, RootStackParamList} from '../../types';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/AntDesign';
import {apiClient, request} from '../../services/api';
import {showToast} from '../../utils/toast';

type ShopScreenProps = NativeStackScreenProps<RootStackParamList, 'ShopScreen'>;

const ShopScreen = ({route, navigation}: ShopScreenProps) => {
  const [shopCats, setShopCats] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const {shop}: any = route.params;

  const goToProductScreen = useCallback(
    (product: Product, category: Category) => {
      navigation.navigate('ProductScreen', {product, category});
    },
    [navigation],
  );

  const getShopCats = useCallback(async () => {
    const abortController = new AbortController();

    try {
      const res = await apiClient.get(`/buyer/shops/${shop._id}/categories`, {
        signal: abortController.signal,
      });

      if (res.data.success) {
        const categories = res.data.categories as Category[];
        setShopCats(categories);
        setSelectedCat(categories[0] || null);
      }
    } catch (error: any) {
      if (!abortController.signal.aborted) {
        console.error('Error fetching categories:', error);
        showToast('error', 'Error', error.message);
      }
    }

    return () => abortController.abort();
  }, [shop._id]);

  const getShopProducts = useCallback(
    async (category: Category | null) => {
      if (!category) return;

      const abortController = new AbortController();

      try {
        const res = await apiClient.get(
          `/buyer/shops/${shop._id}/categories/${category._id}/products`,
          {
            signal: abortController.signal,
          },
        );

        if (res.data.success) {
          setProducts(res.data.products as Product[]);
        }
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching products:', error);
          showToast('error', error.message);
        }
      }

      return () => abortController.abort();
    },
    [shop._id],
  );

  useEffect(() => {
    const fetchData = async () => {
      await getShopCats();
      if (shopCats.length > 0) {
        getShopProducts(shopCats[0]);
      }
    };
    fetchData();
  }, [getShopCats, getShopProducts, shopCats.length]);

  // useEffect(() => {
  //   getShopCats();
  // }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={17} color={'black'} />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={styles.container}>
          <View>
            <Text style={styles.textStyle}>Prakash Watch Center</Text>
            <Text style={styles.textStyle}>Mon-Sun(10am - 9pm)</Text>
            <Text style={styles.textStyle}>
              Address: Sahson, Opp. Ram Janaki Mandir
            </Text>
            <Text style={styles.textStyle}>Voice Message?</Text>
          </View>

          <Image
            source={{
              uri: 'https://d27k8xmh3cuzik.cloudfront.net/wp-content/uploads/2018/03/street-shopping-in-india-cover.jpg',
            }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={{width: '90%'}}>
            <FlatList
              data={shopCats}
              keyExtractor={item => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.catNav}
                  key={item._id}
                  onPress={() => {
                    setSelectedCat(item), getShopProducts(item);
                  }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.shopListContainer}>
            {products.map((product: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.shopCard}
                onPress={() => goToProductScreen(product, selectedCat)}>
                <Text style={styles.shopName}>{product.productName}</Text>
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
    width: '100%',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderColor: 'black',
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
    textAlign: 'center',
  },
  catNav: {
    height: 40,
    borderRadius: 7,
    flexShrink: 1, // Allows the width to shrink if needed
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'orange',
    paddingHorizontal: 15, // Adds space around the text instead of a fixed width
    marginTop: 5,
  },
  horizontalScrollView: {
    flex: 1,
    marginTop: 20,
  },
  image: {
    width: '95%',
    height: 200,
    marginTop: 10,
  },
});

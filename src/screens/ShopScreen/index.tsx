import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {apiClient} from '../../services/api';
import {showToast} from '../../utils/toast';
import {
  TCategory,
  TProduct,
  RootStackParamList,
  TShop,
  TSeller,
} from '../../types';
import ProductCard from '../../components/ProductCard';
import {Theme} from '../../theme/theme';
import {useAppSelector} from '../../redux/hooks';

type ShopScreenProps = NativeStackScreenProps<RootStackParamList, 'ShopScreen'>;

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10;

const ShopScreen = ({route, navigation}: ShopScreenProps) => {
  const [shopCats, setShopCats] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const {shop}: {shop: TShop} = route.params;
  const {cart = [], wishlist = []} = useAppSelector(state => state.buyer);

  const goToProductScreen = useCallback(
    (product: TProduct, category: TCategory) => {
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
        const categories = res.data.categories as TCategory[];
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
    async (category: TCategory | null) => {
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
          setProducts(res.data.products as TProduct[]);
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

  const onChatPress = (shop: TShop) => {
    // console.log('++++++++++++++++++++', shop);
    navigation.navigate('PersonalChatScreen', {shop});
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text
          style={[
            styles.shopTitle,
            {width: '100%', textAlign: 'left', paddingLeft: 5},
          ]}>
          {shop.shopName}
        </Text>
      </View>

      {/* Main Content */}
      <FlatList
        data={products}
        numColumns={2}
        ListHeaderComponent={
          <>
            {/* Shop Info Section */}
            <View style={[styles.shopInfoContainer]}>
              <View style={[styles.shopImage, {position: 'relative'}]}>
                <Image
                  source={{
                    uri:
                      shop?.shopPic ||
                      'https://d27k8xmh3cuzik.cloudfront.net/wp-content/uploads/2018/03/street-shopping-in-india-cover.jpg',
                  }}
                  style={[styles.shopImage]}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 7,
                    borderRadius: 50,
                  }}>
                  <Icons
                    name="hearto"
                    size={20}
                    color="#FFF"
                    // style={{position: 'absolute', top: 16, right: 16}}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => onChatPress(shop)}
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 7,
                    borderRadius: 50,
                  }}>
                  <Icons
                    name="message1"
                    size={20}
                    color="#FFF"
                    // style={{position: 'absolute', top: 16, right: 16}}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Icons name="clockcircleo" size={16} color="#FFA725" />
                  <Text style={styles.infoText}>
                    {shop.shopTiming.open} - {shop.shopTiming.close}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icons name="enviromento" size={16} color="#1F7D53" />
                  <Text style={styles.infoText}>
                    {(shop.sellerId as TSeller).address.street},{' '}
                    {(shop.sellerId as TSeller).address.city}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icons
                    name="play"
                    size={16}
                    color={Theme.colors.mainYellow}
                  />
                  <Text style={styles.infoText}>{shop.titleMsg}</Text>
                </View>
              </View>
            </View>

            {/* Categories */}
            <FlatList
              horizontal
              data={shopCats}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    // styles.categoryButton,
                    Theme.buttons.primary,
                    selectedCat?._id === item._id && styles.selectedCategory,
                  ]}
                  onPress={() => {
                    setSelectedCat(item);
                    getShopProducts(item);
                  }}>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCat?._id === item._id &&
                        styles.selectedCategoryText,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
              nestedScrollEnabled // Add this for Android
            />
          </>
        }
        columnWrapperStyle={styles.productsWrapper}
        renderItem={({item}) => {
          const isInWishList = !!wishlist?.find(
            listItem => listItem.productId?._id === item._id,
          );

          return (
            <ProductCard
              product={item}
              selectedCat={selectedCat}
              goToProductScreen={goToProductScreen}
              isFavorite={isInWishList}
              onChatPress={() => onChatPress(shop)}
            />
          );
        }}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    marginRight: 10,
  },
  shopTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  // scrollContent: {
  //   paddingBottom: 20,
  // },
  shopInfoContainer: {
    backgroundColor: '#FFF',
    marginBottom: 16,
    paddingBottom: 16,
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFD65A',
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: Theme.colors.mainYellow,
  },
  categoryText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'black',
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  productDetails: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A59FE',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 20,
    // Remove flexGrow: 1 if present
  },
  productsWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  // Ensure categoriesContainer has no height constraint
  categoriesContainer: {
    paddingVertical: 12,
    paddingLeft: 10,
  },
});

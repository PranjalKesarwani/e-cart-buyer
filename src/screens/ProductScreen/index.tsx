import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  TProductAttribute,
  RootStackParamList,
  TProduct,
  TCategory,
} from '../../types';
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
import ProductCard from '../../components/ProductCard';
import {Theme} from '../../theme/theme';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {manageCart, manageWishList} from '../../utils/helper';

type ProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductScreen'
>;

const ProductScreen = ({route, navigation}: ProductScreenProps) => {
  const {product, category}: {product: TProduct; category: TCategory} =
    route.params;
  const dimension = Dimensions.get('window').width;
  const [isFavorite, setIsFavorite] = useState(false);
  const [subCats, setSubCats] = useState<any[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<null | TCategory>(null);
  const [products, setProducts] = useState<[] | TProduct[]>([]);
  const {cartItemsCount, wishlist, cart} = useAppSelector(state => state.buyer);
  const [isItemInCart, setIsItemInCart] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    manageWishList(product._id, !isFavorite, dispatch);
  };

  useEffect(() => {}, []);

  const getSubCats = async () => {
    try {
      const res = await apiClient.get(
        `/buyer/shops/${product.shopId}/categories/${category.slug}`,
      );
      setSubCats(res.data.subcategories);
      if (res.data.subcategories.length === 0) {
        setSelectedSubCat(null);
      } else {
        setSelectedSubCat(res.data.subcategories[0]);
      }
    } catch (error: any) {
      console.log(error);
      showToast('error', 'Error', error.message);
    }
  };

  const getShopProducts = async (category: any) => {
    try {
      const res = await apiClient.get(
        `/buyer/shops/${product.shopId}/categories/${category._id}/products`,
      );
      if (!res?.data.success) throw new Error(res?.data.message);
      setProducts(res.data.products);
    } catch (error: any) {
      console.log('error', error.message);
      showToast('error', error.message);
    }
  };
  const isProductExistInCart = () => {
    const result = cart.some((cartItem: any) =>
      cartItem.items.some(
        (item: TProduct) => item.productId._id === product._id,
      ),
    );
    setIsItemInCart(result);
  };
  useEffect(() => {
    getSubCats();
    isProductExistInCart();
  }, [product]);

  useEffect(() => {
    if (selectedSubCat) {
      getShopProducts(selectedSubCat);
    }
  }, [selectedSubCat]);

  const goToProductNestedProductScreen = (product: TProduct) => {
    navigation.push('ProductScreen', {
      product,
      category: selectedSubCat,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={20} color={'black'} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 15,
            color: 'black',
            fontWeight: '500',
            maxWidth: '50%',
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          Om Prakash General Store
        </Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
          </View>
          <Icons name="shoppingcart" size={28} color={'black'} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        data={products} // Main data for related products
        ListHeaderComponent={
          <>
            {/* Image Carousel */}
            <View style={styles.carouselContainer}>
              <Carousel
                loop
                width={dimension}
                height={340}
                autoPlay={true}
                data={product.media.images as string[]}
                scrollAnimationDuration={1000}
                renderItem={({item}) => (
                  <Image
                    source={{uri: item}}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={toggleFavorite}>
                <Icons
                  name="heart"
                  size={24}
                  color={
                    wishlist.some(
                      listItem => listItem.productId._id === product._id,
                    )
                      ? '#ff3f6c'
                      : '#94969f'
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.productInfoContainer}>
              <View style={[styles.productHeader]}>
                <Text style={styles.productName}>{product.productName}</Text>
                <TouchableOpacity style={styles.chatButton}>
                  <Icons name="message1" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Pricing Information */}
              <View style={[styles.priceContainer]}>
                <Text style={styles.priceText}>
                  ₹{product.price}
                  {product.price < product.productMrp && (
                    <>
                      <Text style={styles.originalPrice}>
                        {' '}
                        ₹{product.productMrp}
                      </Text>
                      <Text style={styles.discount}>
                        {' '}
                        {product.discountPercentage}% off
                      </Text>
                    </>
                  )}
                </Text>
                {product.productShortDescription &&
                  product.productShortDescription.length > 0 && (
                    <Text style={styles.description}>
                      {product.productShortDescription}
                    </Text>
                  )}
                {Object.entries(product.attributes).length > 0 && (
                  <View style={[styles.specsContainer]}>
                    <Text style={styles.sectionTitle}>
                      Product Specifications
                    </Text>

                    {Object.entries(product.attributes).map(
                      ([key, value]: any, index) => {
                        return (
                          <View
                            key={key}
                            style={[
                              styles.specRow,
                              index % 2 !== 0 && {backgroundColor: '#f9f9f9'},
                              index ===
                                Object.entries(product.attributes).length -
                                  1 && {
                                borderBottomWidth: 0,
                              },
                            ]}>
                            <Text style={styles.specKey}>{key}</Text>
                            <Text style={styles.specValue}>{value}</Text>
                          </View>
                        );
                      },
                    )}
                  </View>
                )}
              </View>

              {/* Product Variants */}
              {products.length > 0 && (
                <Text style={styles.sectionHeading}>Related Products</Text>
              )}
              <FlatList
                horizontal
                data={subCats}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subCatList}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => setSelectedSubCat(item)}
                    style={[
                      Theme.buttons.primary,
                      selectedSubCat?._id === item._id && {
                        backgroundColor: Theme.colors.mainYellow,
                      },
                    ]}>
                    <Text style={styles.variantText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        }
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.productsColumnWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            selectedCat={selectedSubCat as TCategory}
            goToProductScreen={goToProductNestedProductScreen}
          />
        )}
        ListFooterComponent={<View style={{height: 80}} />}
      />

      {/* Fixed Footer */}
      <View style={[styles.footer]}>
        <View style={{width: '50%'}}>
          {!isItemInCart ? (
            <TouchableOpacity
              style={[styles.addToCartButton]}
              onPress={() => {
                manageCart(product._id, 'ADD', 1, dispatch);
              }}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.addToCartButton]}
              onPress={() => {
                console.log('do nothing bro');
              }}>
              <Text style={styles.addToCartText}>Go to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={[styles.buyNowButton]}
            onPress={() => {
              /* Add to cart logic */
            }}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#2e2e2e',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Theme.colors.mainYellow,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  shopName: {
    fontSize: 16,
    color: '#7e808c',
    textAlign: 'center',
    marginVertical: 8,
  },
  carouselContainer: {
    height: 340,
    backgroundColor: '#f5f5f6',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfoContainer: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#2e2e2e',
    flex: 1,
    marginRight: 16,
  },
  chatButton: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // priceContainer: {
  //   marginBottom: 24,
  // },
  priceText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2e2e2e',
  },
  // originalPrice: {
  //   fontSize: 18,
  //   color: '#7e808c',
  //   textDecorationLine: 'line-through',
  // },
  discount: {
    fontSize: 18,
    color: '#26a541',
  },
  description: {
    fontSize: 16,
    color: '#7e808c',
    marginTop: 8,
    lineHeight: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e2e2e',
    marginBottom: 12,
  },
  subCatList: {
    paddingBottom: 8,
  },
  variantButton: {
    backgroundColor: '#f5f5f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#d4d5d9',
  },
  variantText: {
    color: '#2e2e2e',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f6',
    elevation: 8,
  },

  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: '#f5f5f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    position: 'absolute',
    bottom: 10,
    right: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addToCartButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderRadius: 28,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Border for white button
    width: '100%',
  },
  addToCartText: {
    color: '#333', // Text color for Add to Cart
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.mainYellow,
    // borderRadius: 28,
    paddingVertical: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buyNowText: {
    color: '#333', // Text color for Buy Now
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productsColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productThumbnail: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    borderRadius: 8,
  },
  productDetails: {
    paddingHorizontal: 4,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e2e2e',
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e2e2e',
  },
  originalPrice: {
    fontSize: 12,
    color: '#7e808c',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountPercentage: {
    fontSize: 12,
    color: '#26a541',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  specsContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E2E2E',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  specKey: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  specValue: {
    flex: 1,
    color: '#2E2E2E',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});

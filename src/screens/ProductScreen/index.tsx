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
  const {product, category}: any = route.params;
  const dimension = Dimensions.get('window').width;
  const [isFavorite, setIsFavorite] = useState(false);
  const [subCats, setSubCats] = useState<any[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getSubCats = async () => {
    try {
      // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%88888%%%%%%%%');

      const res = await apiClient.get(
        `/buyer/shops/${product.shopId}/categories/${category.slug}`,
      );
      // console.log('}}}}}}}}}}}}}}}}}}', res.data.subcategories);
      setSubCats(res.data.subcategories);
      if (res.data.subcategories.length === 0) {
        setSelectedSubCat(null);
        // setProducts([]);
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
      // console.log(
      //   '%%%%%%%%%%%%%%%%%%%%%%7777%%%%%%%%%%%%%%%%%%%%%%%',
      //   category.name,
      // );

      const res = await apiClient.get(
        `/buyer/shops/${product.shopId}/categories/${category._id}/products`,
      );
      // console.log('***********', res.data.products);
      if (!res?.data.success) throw new Error(res?.data.message);
      setProducts(res.data.products);
    } catch (error: any) {
      console.log('error', error.message);
      showToast('error', error.message);
    }
  };

  useEffect(() => {
    getSubCats();
  }, [product]);

  useEffect(() => {
    if (selectedSubCat) {
      getShopProducts(selectedSubCat);
    }
  }, [selectedSubCat]);

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
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
          <Icons name="shoppingcart" size={28} color={'black'} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        data={products} // Main data for related products
        ListHeaderComponent={
          <>
            {/* Product Header Section */}
            <Text style={styles.shopName}>
              {product.shop?.name || 'Prakash Watch Center'}
            </Text>

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
            </View>

            {/* Product Details */}
            <View style={styles.productInfoContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.productName}</Text>
                <TouchableOpacity style={styles.chatButton}>
                  <Icons name="message1" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Pricing Information */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  ₹{product.price}
                  <Text style={styles.originalPrice}> ₹{product.mrp}</Text>
                  <Text style={styles.discount}>
                    {' '}
                    {product.discountPercentage}% off
                  </Text>
                </Text>
                <Text style={styles.description}>{product.description}</Text>
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
                    style={styles.variantButton}>
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
          <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
              navigation.push('ProductScreen', {
                product: item,
                category: selectedSubCat,
              })
            }>
            <Image
              source={{uri: item.media.images[0]}}
              style={styles.productThumbnail}
              resizeMode="contain"
            />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.productName}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>₹{item.price}</Text>
                <Text style={styles.originalPrice}>₹{item.mrp}</Text>
                <Text style={styles.discountPercentage}>
                  {item.discountPercentage}% off
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{height: 80}} />}
      />

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={toggleFavorite}>
          <Icons
            name="heart"
            size={28}
            color={isFavorite ? '#ff3f6c' : '#94969f'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            /* Add to cart logic */
          }}>
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
    backgroundColor: '#ff3f6c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: '#fff',
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
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2e2e2e',
    flex: 1,
    marginRight: 16,
  },
  chatButton: {
    backgroundColor: '#ff3f6c',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // priceContainer: {
  //   marginBottom: 24,
  // },
  priceText: {
    fontSize: 24,
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f6',
    elevation: 8,
  },
  wishlistButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#ff3f6c',
    borderRadius: 28,
    paddingVertical: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});

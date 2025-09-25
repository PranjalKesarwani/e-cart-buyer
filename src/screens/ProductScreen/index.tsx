import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  TProductAttribute,
  RootStackParamList,
  TProduct,
  TCategory,
  TCart,
  TShop,
  IAddress,
} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import {Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import ProductCard from '../../components/ProductCard';
import {Theme} from '../../theme/theme';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {manageCart, manageWishList} from '../../utils/helper';
import {Dispatch} from '@reduxjs/toolkit';
import {
  getShopProductsByCat,
  getSubCatsForShop,
  placeBuyNowOrder,
} from '../../services/apiService';
import {HomeLevel2Cats} from '../HomeScreen/HomeLevel2Cats';

type ProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductScreen'
>;

const dimension = Dimensions.get('window').width;
// const {width} = Dimensions.get('window');
const CARD_WIDTH = (dimension - Theme.spacing.sm * 2) / 2 - 6; // responsive
const IMAGE_SIZE_PREVIEW = 54; // smaller preview avatar
const IMAGE_SIZE_GRID = 48; // smaller grid avatars

const ProductScreen = ({route, navigation}: ProductScreenProps) => {
  const {product, category}: {product: TProduct; category: TCategory} =
    route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [subCats, setSubCats] = useState<any[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<null | TCategory>(null);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const [products, setProducts] = useState<[] | TProduct[]>([]);
  const {cartItemsCount, wishlist, cart, selectedShop, activeAddress} =
    useAppSelector(state => state.buyer);
  const [isItemInCart, setIsItemInCart] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    manageWishList(product._id, !isFavorite, dispatch);
  };

  const mrp = Number(product.productMrp ?? 0);
  const price = Number(product.price ?? 0);

  const showDiscount = mrp > 0 && price < mrp;
  const discountPercent = showDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;
  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  const formattedMrp = `₹${mrp.toLocaleString('en-IN')}`;

  const getSubCats = async () => {
    try {
      console.log('Product screen category testing', category);
      const {status, message, data} = await getSubCatsForShop(
        product.shopId,
        category._id,
        product._id,
      );
      if (!status) {
        showToast('error', 'Error', message);
        return;
      }
      setSubCats(data.subcategories);
      if (data.subcategories.length === 0) {
        setSelectedSubCat(null);
      } else {
        setSelectedSubCat(data.subcategories[0]);
      }
    } catch (error: any) {
      console.log(error);
      showToast('error', 'Error', error.message);
    }
  };

  const getShopProducts = async (category: any) => {
    try {
      const {status, message, data} = await getShopProductsByCat(
        product.shopId,
        category._id,
      );
      if (!status) {
        setProducts([]);
        return;
      }
      setProducts(data.products ?? []);
    } catch (error: any) {
      console.log('error', error.message);
      showToast('error', error.message);
    }
  };
  const isProductExistInCart = (carts: TCart[]) => {
    if (carts.length > 0) {
      const result = carts.some((cartItem: any) =>
        cartItem.items.some(
          (item: TProduct) => item.productId._id === product._id,
        ),
      );
      setIsItemInCart(result);
    }
  };
  useEffect(() => {
    getSubCats();
    isProductExistInCart(cart);
  }, [product]);

  useEffect(() => {
    if (selectedSubCat) {
      // console.log('---------->>>>>', selectedSubCat.name);
      getShopProducts(selectedSubCat);
    }
  }, [selectedSubCat]);

  const goToProductNestedProductScreen = (product: TProduct) => {
    navigation.push('ProductScreen', {
      product,
      category: selectedSubCat,
    });
  };

  const handleCart = async (
    productId: string,
    action: string,
    quantity: number,
  ) => {
    const newCarts = await manageCart(productId, action, quantity, dispatch);
    isProductExistInCart(newCarts.cart);
  };

  const onChatPress = () => {
    navigation.navigate('PersonalChatScreen', {shop: selectedShop as TShop});
  };

  const handleOrderProduct = async () => {
    console.log('handleOrderProduct', product._id, selectedShop);
    const {status, message, data} = await placeBuyNowOrder(
      product,
      activeAddress as IAddress,
      orderQuantity,
    );
    if (!status) {
      showToast('error', 'Error', message);
      return;
    }
    setIsBuyModalVisible(false);
    showToast('success', 'Success', 'Order placed successfully!');
  };

  const handleCardPress = async (category: TCategory) => {
    setSelectedSubCat(category);
    // Fetch products for the selected category
    getShopProducts(category);
  };

  function isMapLike(obj: any) {
    return (
      obj instanceof Map ||
      (obj &&
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        Object.getPrototypeOf(obj) === Object.prototype &&
        Object.keys(obj).length > 0 &&
        Object.values(obj).every(v => v !== undefined))
    );
  }

  // Prefer value when attribute stored as { value: ... , type:..., ... }
  function unwrapAttributeRaw(raw: any) {
    if (raw === null || raw === undefined) return raw;
    // If it's a Map (client could get Map() too)
    if (raw instanceof Map) {
      // try value key inside
      if (raw.has('value')) return raw.get('value');
      // fallback to plain object representation
      const obj: any = {};
      raw.forEach((v: any, k: any) => (obj[k] = v));
      if ('value' in obj) return obj.value;
      return obj;
    }

    // plain object with metadata e.g. { type, value, searchable, ... }
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      // Common pattern: { value: ... }
      if ('value' in raw) return raw.value;
      // Sometimes enums are { values: [...] }
      if ('values' in raw && Array.isArray(raw.values)) return raw.values;
      // if object looks like nested map/attrs, return as object to be handled later
      return raw;
    }

    // primitives and arrays
    return raw;
  }

  function hasAttributes(attrs: any): boolean {
    if (!attrs) return false;
    if (attrs instanceof Map) return attrs.size > 0;
    if (Array.isArray(attrs)) return attrs.length > 0;
    if (typeof attrs === 'object') return Object.keys(attrs).length > 0;
    return false;
  }

  // Return sanitized entries [key, { raw, value }] to preserve metadata for later
  function getAttributeEntries(attrs: any): [string, {raw: any; value: any}][] {
    if (!attrs) return [];

    // If Map
    if (attrs instanceof Map) {
      return Array.from(attrs.entries()).map(([k, raw]) => [
        String(k),
        {raw, value: unwrapAttributeRaw(raw)},
      ]);
    }

    // If plain object (typical from JSON over REST)
    if (typeof attrs === 'object' && !Array.isArray(attrs)) {
      return Object.entries(attrs)
        .filter(([k, v]) => v !== undefined && v !== null)
        .map(([k, raw]) => [String(k), {raw, value: unwrapAttributeRaw(raw)}]);
    }

    // If someone passed array of pairs [{ key, value }] or [{k,v}]
    if (Array.isArray(attrs)) {
      return attrs
        .map((a: any) => {
          if (!a) return null;
          if ('key' in a && 'value' in a)
            return [
              String(a.key),
              {raw: a, value: unwrapAttributeRaw(a.value)},
            ];
          if (Array.isArray(a) && a.length >= 2)
            return [String(a[0]), {raw: a[1], value: unwrapAttributeRaw(a[1])}];
          return null;
        })
        .filter(Boolean) as [string, {raw: any; value: any}][];
    }

    return [];
  }

  function formatAttrLabel(k: string) {
    return k
      .replace(/[_\-]/g, ' ')
      .replace(/\b\w/g, s => s.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();
  }

  function StringifyShort(v: any) {
    if (v === null || v === undefined || v === '') return '—';
    if (
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean'
    )
      return String(v);
    try {
      const s = JSON.stringify(v);
      if (s.length > 50) return s.slice(0, 47) + '…';
      return s;
    } catch (e) {
      return String(v);
    }
  }

  // --- renderer ---
  function renderAttrValue(value: any, rawMeta?: any): JSX.Element {
    // value here is the unwrapped value (primitive / array / object)
    if (value === null || value === undefined || value === '') {
      return <Text style={styles.specValue}>—</Text>;
    }

    if (typeof value === 'boolean') {
      return <Text style={styles.specValue}>{value ? 'Yes' : 'No'}</Text>;
    }

    if (typeof value === 'number' || typeof value === 'string') {
      // If there's a unit in rawMeta (e.g., rawMeta.units) append it as small text
      if (rawMeta && typeof rawMeta === 'object' && rawMeta.units) {
        return (
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.specValue}>{String(value)}</Text>
            <Text style={styles.specValueSmall}>{String(rawMeta.units)}</Text>
          </View>
        );
      }
      return <Text style={styles.specValue}>{String(value)}</Text>;
    }

    // arrays: primitives -> join, complex -> bullet list
    if (Array.isArray(value)) {
      const allPrimitives = value.every(v =>
        ['string', 'number', 'boolean'].includes(typeof v),
      );
      if (allPrimitives) {
        return (
          <Text style={styles.specValue}>
            {value.map(v => String(v)).join(', ')}
          </Text>
        );
      }
      return (
        <View style={{alignItems: 'flex-end'}}>
          {value.map((v, i) => (
            <Text key={i} style={styles.specValueSmall}>
              • {StringifyShort(v)}
            </Text>
          ))}
        </View>
      );
    }

    // objects: if rawMeta had type info that implies showing value differently, handle that
    if (typeof value === 'object') {
      // If this object came from metadata that contained displayable 'value' nested as object,
      // try common shapes: { label, name } or { min, max } (range)
      if ('label' in value && typeof value.label === 'string') {
        return <Text style={styles.specValue}>{value.label}</Text>;
      }

      if ('min' in value || 'max' in value) {
        const parts: string[] = [];
        if ('min' in value) parts.push(String(value.min));
        if ('max' in value) parts.push(String(value.max));
        return <Text style={styles.specValue}>{parts.join(' - ')}</Text>;
      }

      // Generic object -> show up to N pairs, like Flipkart compact view
      const entries = Object.entries(value).slice(0, 6);
      return (
        <View style={{alignItems: 'flex-end'}}>
          {entries.map(([k, v]) => (
            <Text key={k} style={styles.specValueSmall}>
              {formatAttrLabel(k)}: {StringifyShort(v)}
            </Text>
          ))}
          {Object.keys(value).length > 6 && (
            <Text style={styles.specValueSmall}>…</Text>
          )}
        </View>
      );
    }

    return <Text style={styles.specValue}>{String(value)}</Text>;
  }

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
          onPress={() => console.log('go to cart screen')}>
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
                <TouchableOpacity
                  onPress={onChatPress}
                  style={styles.chatButton}>
                  <Icons name="message1" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Pricing Information */}
              <View style={[styles.priceContainer]}>
                <Text style={styles.priceText}>
                  ₹{price}
                  {product.price < product.productMrp && (
                    <>
                      <Text style={styles.originalPrice}> ₹{mrp}</Text>
                      <Text style={styles.discount}>
                        {' '}
                        {discountPercent}% off
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

                {hasAttributes(product.attributes) && (
                  <View style={styles.specsContainer}>
                    <Text style={styles.sectionTitle}>
                      Product Specifications
                    </Text>

                    {getAttributeEntries(product.attributes).map(
                      ([rawKey, {raw, value}], index) => {
                        const key = String(rawKey);
                        const isLast =
                          index ===
                          getAttributeEntries(product.attributes).length - 1;
                        return (
                          <View
                            key={key + index}
                            style={[
                              styles.specRow,
                              index % 2 !== 0 && styles.specRowAlt,
                              isLast && {borderBottomWidth: 0},
                            ]}>
                            <Text style={styles.specKey}>
                              {formatAttrLabel(key)}
                            </Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                              {renderAttrValue(value, raw)}
                            </View>
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
                contentContainerStyle={[styles.subCatList]}
                renderItem={({item}) => {
                  const isActive = selectedSubCat?._id === item._id;
                  return (
                    <TouchableOpacity
                      style={styles.previewItem}
                      activeOpacity={0.8}
                      onPress={() => setSelectedSubCat(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${item.name} category`}>
                      <Image
                        source={{uri: item.image}}
                        style={styles.previewImage}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.previewText,
                          isActive && styles.previewTextActive,
                        ]}>
                        {item.name}
                      </Text>
                      {isActive ? (
                        <View style={styles.activeIndicator} />
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </>
        }
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={[styles.productsColumnWrapper]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer]}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            cardWidth={CARD_WIDTH}
            selectedCat={selectedSubCat as TCategory}
            goToProductScreen={goToProductNestedProductScreen}
            onChatPress={onChatPress}
          />
        )}
        ListFooterComponent={<View style={{height: 80}} />}
      />

      <Modal
        visible={isBuyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsBuyModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Product Image */}
            <Image
              source={{uri: product.media.images[0]}}
              style={styles.modalImage}
              resizeMode="contain"
            />

            {/* Product Price */}
            <View style={styles.priceRow}>
              <Text style={styles.modalPrice}>₹{product.price}</Text>
              {product.price < product.productMrp && (
                <Text style={styles.modalOriginalPrice}>
                  ₹{product.productMrp}
                </Text>
              )}
            </View>
            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    orderQuantity === 1 && styles.disabledButton,
                  ]}
                  onPress={() =>
                    orderQuantity > 1 && setOrderQuantity(orderQuantity - 1)
                  }
                  disabled={orderQuantity === 1}>
                  <Icons
                    name="minus"
                    size={20}
                    color={orderQuantity === 1 ? '#ccc' : '#000'}
                  />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{orderQuantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setOrderQuantity(orderQuantity + 1)}>
                  <Icons name="plus" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Address Section */}
            <View style={styles.addressContainer}>
              <View style={styles.addressHeader}>
                <Icons name="enviromento" size={20} color="#ff3f6c" />
                <Text style={styles.addressTitle}>Delivery Address</Text>
              </View>
              <Text style={styles.addressText}>
                {activeAddress?.completeAddress}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsBuyModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={() => {
                  handleOrderProduct();
                }}>
                <Text style={styles.placeOrderText}>
                  Place Order • ₹{(product.price * orderQuantity).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Fixed Footer */}
      <View style={[styles.footer]}>
        <View style={{width: '50%'}}>
          {!isItemInCart ? (
            <TouchableOpacity
              style={[styles.addToCartButton]}
              onPress={() => {
                handleCart(product._id, 'ADD', 1);
              }}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.addToCartButton]}
              onPress={() => {
                console.log('go to cart screen');
              }}>
              <Text style={styles.addToCartText}>Go to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={[styles.buyNowButton]}
            onPress={() => {
              setIsBuyModalVisible(true);
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

  priceText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2e2e2e',
  },

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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e2e2e',
    marginRight: 12,
  },
  modalOriginalPrice: {
    fontSize: 18,
    color: '#7e808c',
    textDecorationLine: 'line-through',
  },
  addressContainer: {
    borderWidth: 1.5,
    borderColor: '#ff3f6c',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff9fa',
    marginBottom: 24,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e2e2e',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#4a4a4a',
    lineHeight: 24,
    marginBottom: 12,
  },
  changeAddressButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f6',
    borderRadius: 6,
  },
  changeAddressText: {
    color: '#ff3f6c',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#f5f5f6',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2e2e2e',
    fontSize: 16,
    fontWeight: '600',
  },
  placeOrderButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#ff3f6c',
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e2e2e',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4d5d9',
    borderRadius: 8,
  },
  quantityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quantityValue: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#2e2e2e',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#d4d5d9',
  },
  disabledButton: {
    opacity: 0.5,
  },
  previewItem: {
    width: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllCircle: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: Theme.colors.primary,
  },
  previewImage: {
    width: IMAGE_SIZE_PREVIEW,
    height: IMAGE_SIZE_PREVIEW,
    borderRadius: IMAGE_SIZE_PREVIEW / 2,
    resizeMode: 'cover',
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  previewTextActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  previewText: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 78,
    color: '#222',
  },

  // small underline indicator (Zomato-like)
  activeIndicator: {
    marginTop: 6,
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
  },
  specValueSmall: {
    color: '#4a4a4a',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right',
  },
  specRowAlt: {
    backgroundColor: '#fff',
  },
});

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal,
  Linking,
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
  RootDrawerParamList,
} from '../../types';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import {Theme} from '../../theme/theme';
import {useAppSelector} from '../../redux/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {goBack, navigate} from '../../navigation/navigationService';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {getSubCatsForShop} from '../../services/apiService';

type ShopScreenRouteProp = RouteProp<RootDrawerParamList, 'ShopScreen'>;
type ShopScreenNavProp = StackNavigationProp<RootDrawerParamList, 'ShopScreen'>;

type ShopScreenProps = {
  route: ShopScreenRouteProp;
  navigation: ShopScreenNavProp;
};
const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - Theme.spacing.sm * 2) / 2 - 6; // responsive

const ShopScreen = ({route, navigation}: ShopScreenProps) => {
  const insets = useSafeAreaInsets();
  const [shopCats, setShopCats] = useState<TCategory[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [selectedCat, setSelectedCat] = useState<TCategory | null>(null);
  // const route  = useRoute();
  const {shop, catId} = route.params ?? {
    shop: /* fallback? */ null as any,
    catId: null,
  };
  const {wishlist = []} = useAppSelector(state => state.buyer);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [sellerModalVisible, setSellerModalVisible] = useState(false);

  const formattedCompleteAddress = [
    shop?.address?.completeAddress?.trim(),
    shop?.address?.landmark?.trim(),
  ]
    .filter(Boolean)
    .join(' • ');

  const sellerPhone =
    (shop.sellerId as TSeller)?.mobile || 'Contact not available';

  const goToProductScreen = useCallback(
    (product: TProduct, category: TCategory) => {
      navigate('ProductScreen', {product, category});
    },
    [navigation],
  );

  const getShopCats = useCallback(async () => {
    setLoadingCats(true);
    const abortController = new AbortController();
    try {
      const {status, message, data} = await getSubCatsForShop(shop._id, null);

      if (status) {
        // const categories = (res.data.categories ?? []) as TCategory[];
        const subCategories = (data.subcategories ?? []) as TCategory[];
        setShopCats(subCategories);
        setSelectedCat(prev => prev ?? subCategories[0] ?? null);
      } else {
        showToast('error', 'Error', message || 'Failed to load categories');
      }
    } catch (error: any) {
      if (!abortController.signal.aborted) {
        console.error('Error fetching categories:', error);
        showToast(
          'error',
          'Error',
          error.message || 'Failed to load categories',
        );
      }
    } finally {
      setLoadingCats(false);
    }

    return () => abortController.abort();
  }, [shop._id]);

  const getShopProducts = useCallback(
    async (category: TCategory | null) => {
      if (!category) return;
      setLoadingProducts(true);
      const abortController = new AbortController();

      try {
        const res = await apiClient.get(
          `/buyer/shops/${shop._id}/categories/${category._id}/products`,
          {signal: abortController.signal},
        );

        if (res.data.success) {
          setProducts(res.data.products ?? []);
        } else {
          setProducts([]);
        }
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching products:', error);
          showToast('error', error.message || 'Failed to load products');
        }
      } finally {
        setLoadingProducts(false);
      }

      return () => abortController.abort();
    },
    [shop._id],
  );

  // initial load
  useEffect(() => {
    getShopCats();
  }, [getShopCats]);

  // whenever selected category changes, load its products
  useEffect(() => {
    getShopProducts(selectedCat);
  }, [getShopProducts, selectedCat]);

  const onChatPress = (s: TShop) => {
    navigate('PersonalChatScreen', {shop: s});
  };

  const renderHeader = () => (
    <>
      {/* Top header row: back + search */}
      <View style={[styles.topHeader, {paddingTop: insets.top || 12}]}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.backWrap}
          accessibilityLabel="Go back">
          <Icons name="arrowleft" size={22} color={Theme.colors.darkText} />
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search by product names"
            onChangeText={() => {}}
            value={''}
            containerStyle={{height: 40}}
          />
        </View>
      </View>

      {/* Shop hero */}
      <View style={styles.shopHeroWrap}>
        <Image
          source={{uri: shop?.shopPic || Theme.defaultImages.shop}}
          style={styles.shopImage}
          resizeMode="cover"
        />

        {/* Large status banner — prominent */}

        {/* compact content area below image */}
        <View style={styles.shopHeroContent}>
          <View style={styles.heroTitleRow}>
            <View style={{flex: 1}}>
              <Text style={styles.shopName} numberOfLines={2}>
                {shop.shopName}
              </Text>

              <View style={styles.smallMetaRow}>
                {shop.minPurchaseAmounts.length > 0 && (
                  <View style={styles.metaItem}>
                    <Icons name="wallet" size={12} color={Theme.colors.gray} />
                    {shop.minPurchaseAmounts[0].deliveryType != 'self' ? (
                      <Text
                        style={
                          styles.metaText
                        }>{`Min Delivery ₹${shop.minPurchaseAmounts[0].amount}`}</Text>
                    ) : (
                      <Text style={styles.metaText}> No Delivery</Text>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* compact profile/avatar */}
            <Image
              source={{uri: Theme.defaultImages.avatar}}
              style={styles.sellerAvatar}
            />
          </View>

          <View style={styles.descriptionWrap}>
            <Text style={styles.shopDescription} numberOfLines={4}>
              {shop.description ?? 'No description available.'}
            </Text>
          </View>

          <View style={styles.addressRow}>
            <Icons name="enviromento" size={16} color={Theme.colors.primary} />
            <Text style={styles.shopAddress} numberOfLines={2}>
              {formattedCompleteAddress || 'Address not available'}
            </Text>
          </View>

          {/* Action row (Call / Directions / Menu) */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, {borderColor: Theme.colors.primary}]}
              onPress={() => Linking.openURL('tel:+919982520785')}
              activeOpacity={0.8}>
              <Icons name="phone" size={16} color={Theme.colors.primary} />
              <Text style={[styles.actionText, {color: Theme.colors.primary}]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, {borderColor: Theme.colors.primary}]}
              onPress={() => {
                const lat = shop.address.location?.coordinates?.[1]; // assuming GeoJSON [lng, lat]
                const lng = shop.address.location?.coordinates?.[0];

                if (lat && lng) {
                  const url =
                    Platform.OS === 'ios'
                      ? `http://maps.apple.com/?ll=${lat},${lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                  Linking.openURL(url);
                } else {
                  // fallback to address if coords missing
                  Linking.openURL(
                    `https://maps.google.com/?q=${encodeURIComponent(
                      formattedCompleteAddress || '',
                    )}`,
                  );
                }
              }}
              activeOpacity={0.8}>
              <Icons name="retweet" size={16} color={Theme.colors.primary} />
              <Text style={[styles.actionText, {color: Theme.colors.primary}]}>
                Directions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellerCtaDetails}
              onPress={() => setSellerModalVisible(true)}
              activeOpacity={0.8}>
              <Text style={styles.sellerCtaText}>Show seller details</Text>
            </TouchableOpacity>
          </View>

          {/* Seller details CTA (secondary) */}
          <View style={[styles.sellerCtaRow]}>
            <View
              style={[
                styles.sellerCta,
                shop.dailyShopStatus === 'closed' && {
                  backgroundColor: Theme.colors.red,
                },
              ]}>
              <Text style={styles.statusLabel}>
                {shop.dailyShopStatus === 'closed' ? 'Closed' : 'Open now'}
              </Text>
              {/* small supporting text: next open/close time if available */}
              <Text style={styles.statusSubText}>
                ({shop.shopTiming.open} - {shop.shopTiming.close})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category pills (unchanged but kept visually below hero) */}
      <View style={styles.categoriesWrap}>
        {loadingCats ? (
          <ActivityIndicator size="small" />
        ) : (
          <FlatList
            horizontal
            data={shopCats}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCat?._id === item._id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCat(item)}>
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
            nestedScrollEnabled
          />
        )}
      </View>
    </>
  );

  const renderProduct = ({item}: {item: TProduct}) => {
    const isInWishList = !!wishlist?.find(w => w.productId?._id === item._id);
    return (
      <View style={[styles.productColumn]}>
        <ProductCard
          product={item}
          selectedCat={selectedCat as TCategory}
          goToProductScreen={goToProductScreen}
          isFavorite={isInWishList}
          onChatPress={() => onChatPress(shop)}
          cardWidth={CARD_WIDTH}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom || 12}]}>
      <FlatList
        data={products}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={[styles.productsWrapper]}
        renderItem={renderProduct}
        keyExtractor={item => item._id}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              (styles.scrollContent.paddingBottom || 24) +
              (insets.bottom || 12),
          },
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrap}>
            {loadingProducts ? (
              <ActivityIndicator size="large" />
            ) : (
              <Text style={styles.emptyText}>No products found</Text>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={{height: Math.max(insets.bottom, 24) + 48}} />
        }
      />

      {/* Seller Details Modal */}
      <Modal
        visible={sellerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSellerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seller details</Text>
              <TouchableOpacity onPress={() => setSellerModalVisible(false)}>
                <Icons name="close" size={20} color={Theme.colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Image
                source={{uri: Theme.defaultImages.avatar}}
                style={styles.modalAvatar}
              />
              <Text style={styles.modalSellerName}>
                {(shop.sellerId as TSeller)?.sellerName}
              </Text>

              <Text style={styles.modalLabel}>Mobile</Text>
              <TouchableOpacity
                onPress={() => {
                  if (!sellerPhone) return;
                  Linking.openURL(`tel:${sellerPhone}`).catch(() => {
                    showToast('error', 'Unable to place call');
                  });
                }}
                disabled={!sellerPhone}>
                <Text
                  style={[
                    styles.modalPhone,
                    !sellerPhone && {color: Theme.colors.gray},
                  ]}>
                  {sellerPhone || 'Not available'}
                </Text>
              </TouchableOpacity>

              {/* optional: close button */}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSellerModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 8,
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  backWrap: {
    padding: 8,
    marginRight: Theme.spacing.sm,
  },
  searchWrap: {
    flex: 1,
  },
  shopHeroWrap: {
    // backgroundColor: Theme.colors.white,
    marginTop: Theme.spacing.sm,
    marginBottom: 20,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    // borderBottomEndRadius: 8,
    // paddingHorizontal: 8,
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 180,
  },
  shopHeroContent: {
    // padding: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: Theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  shopName: {
    ...Theme.typography.h5,
    color: Theme.colors.darkText,
    flex: 1,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  iconCircle: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
  shopSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  infoRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  infoSmall: {
    ...Theme.typography.caption,
    color: Theme.colors.harvestGreen,
    marginLeft: 6,
  },
  shopTagline: {
    ...Theme.typography.body2,
    color: Theme.colors.darkText,
    marginTop: Theme.spacing.xs,
  },
  // shopAddress: {
  //   ...Theme.typography.body2,
  //   color: Theme.colors.darkText,
  //   marginTop: Theme.spacing.xs,
  // },
  categoriesWrap: {
    backgroundColor: Theme.colors.white,
    paddingVertical: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
  },
  categoriesContainer: {
    paddingLeft: Theme.spacing.md,
    paddingRight: Theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: Theme.colors.lightPrimary,
    marginRight: Theme.spacing.sm,
  },
  selectedCategory: {
    backgroundColor: Theme.colors.primary,
  },
  categoryText: {
    ...Theme.typography.button,
    color: Theme.colors.darkText,
  },
  selectedCategoryText: {
    color: Theme.colors.white,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
  },
  productsWrapper: {
    // display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    // marginTop: Theme.spacing.xs,
    marginBottom: 16,
  },
  productColumn: {
    width: CARD_WIDTH,
    marginBottom: Theme.spacing.xs,
  },
  emptyWrap: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    ...Theme.typography.body2,
    color: Theme.colors.gray,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  timingText: {
    ...Theme.typography.caption,
    color: Theme.colors.gray,
    marginLeft: 6,
  },

  descriptionWrap: {
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },

  shopDescription: {
    ...Theme.typography.body2,
    color: Theme.colors.darkText,
    lineHeight: 20,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Theme.spacing.xs,
    gap: 8,
  },
  shopAddress: {
    ...Theme.typography.body2,
    color: Theme.colors.darkText,
    marginLeft: 8,
    flex: 1,
  },

  sellerCtaRow: {
    marginTop: Theme.spacing.md,
    // alignItems: 'flex-start',
    width: '100%',
    flex: 1,
  },
  sellerCta: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomEndRadius: 15,
    borderBottomLeftRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerCtaDetails: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sellerCtaText: {
    color: '#fff',
    fontWeight: '700',
    ...Theme.typography.button,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Theme.spacing.md,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  modalTitle: {
    ...Theme.typography.h5,
    color: Theme.colors.darkText,
  },
  modalBody: {
    alignItems: 'center',
    paddingTop: Theme.spacing.sm,
  },
  modalAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: Theme.spacing.sm,
  },
  modalSellerName: {
    ...Theme.typography.h5,
    fontWeight: '700',
    color: Theme.colors.darkText,
    marginBottom: Theme.spacing.xs,
  },
  modalLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.sm,
  },
  modalPhone: {
    ...Theme.typography.body1,
    color: Theme.colors.primary,
    fontWeight: '700',
    marginTop: 6,
  },
  modalCloseBtn: {
    marginTop: Theme.spacing.md,
    backgroundColor: Theme.colors.lightPrimary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  modalCloseText: {
    ...Theme.typography.button,
    color: Theme.colors.darkText,
    fontWeight: '700',
  },
  shopStatusCapsule: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999, // ensures pill shape
    borderWidth: 1.5,
  },

  // OPEN styles
  openCapsule: {
    backgroundColor: 'rgba(56, 147, 0, 0.5)', // light translucent green
    borderColor: '#389300', // solid green border
  },
  openText: {
    color: '#fff', // darker green for readability
    fontWeight: '700',
    fontSize: 12,
  },

  // CLOSED styles
  closedCapsule: {
    backgroundColor: 'rgba(200, 0, 0, 0.5)', // light translucent red
    borderColor: '#b00020', // solid dark red border
  },
  closedText: {
    color: '#fff', // dark red text
    fontWeight: '700',
    fontSize: 12,
  },
  shopStatusText: {
    color: '#fff',
  },
  statusBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
  },
  openBanner: {
    backgroundColor: Theme.colors.primary,
  },
  closedBanner: {
    backgroundColor: '#b00020', // keep your closed color
  },
  statusLeft: {flexDirection: 'column'},
  statusLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  statusSubText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 5,
    fontWeight: '500',
  },
  statusRight: {flexDirection: 'row', alignItems: 'center'},
  offerBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerText: {color: '#fff', fontWeight: '700', fontSize: 12},
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  smallMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  metaItem: {flexDirection: 'row', alignItems: 'center'},
  metaText: {
    ...Theme.typography.caption,
    color: Theme.colors.gray,
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: {
    marginLeft: 8,
    ...Theme.typography.button,
  },
  primaryActionBtn: {
    marginLeft: 'auto',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  primaryActionText: {
    color: '#fff',
    fontWeight: '700',
    ...Theme.typography.button,
  },
});

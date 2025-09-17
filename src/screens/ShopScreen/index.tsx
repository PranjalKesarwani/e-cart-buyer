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
import SearchBar from '../../components/common/SearchBar';
import {Theme} from '../../theme/theme';
import {useAppSelector} from '../../redux/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ShopScreenProps = NativeStackScreenProps<RootStackParamList, 'ShopScreen'>;

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - Theme.spacing.md * 2 - Theme.spacing.sm) / 2; // responsive

const ShopScreen = ({route, navigation}: ShopScreenProps) => {
  const insets = useSafeAreaInsets();
  const [shopCats, setShopCats] = useState<TCategory[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [selectedCat, setSelectedCat] = useState<TCategory | null>(null);
  const {shop}: {shop: TShop} = route.params;
  const {wishlist = []} = useAppSelector(state => state.buyer);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const goToProductScreen = useCallback(
    (product: TProduct, category: TCategory) => {
      navigation.navigate('ProductScreen', {product, category});
    },
    [navigation],
  );

  const getShopCats = useCallback(async () => {
    setLoadingCats(true);
    const abortController = new AbortController();
    try {
      const res = await apiClient.get(`/buyer/shops/${shop._id}/categories`, {
        signal: abortController.signal,
      });

      if (res.data.success) {
        const categories = (res.data.categories ?? []) as TCategory[];
        setShopCats(categories);
        setSelectedCat(prev => prev ?? categories[0] ?? null);
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
    navigation.navigate('PersonalChatScreen', {shop: s});
  };

  const renderHeader = () => (
    <>
      {/* Top header row: back + search */}
      <View style={[styles.topHeader, {paddingTop: insets.top || 12}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backWrap}>
          <Icons name="arrowleft" size={22} color={Theme.colors.darkText} />
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <SearchBar
            placeholder={`Search by product names`}
            onChangeText={() => {}}
            value={''}
            containerStyle={{height: 40}}
            // inputContainerStyle={{ height: 36 }}
          />
        </View>
      </View>

      {/* Shop hero */}
      <View style={[styles.shopHeroWrap]}>
        <Image
          source={{uri: shop?.shopPic || Theme.defaultImages.shop}}
          style={styles.shopImage}
          resizeMode="cover"
        />

        <View style={[styles.shopHeroContent]}>
          <View style={styles.shopMetaRow}>
            <Text style={styles.shopName}>{shop.shopName}</Text>
            <View style={styles.metaRight}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => onChatPress(shop)}>
                <Icons name="message1" size={20} color={'#44444E'} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconCircle, {marginLeft: 8}]}>
                <Icons
                  name="heart"
                  size={20}
                  color={'#94969f'}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.shopSubRow}>
            <Text style={styles.infoSmall}>
              {' '}
              {shop.shopTiming?.open} - {shop.shopTiming?.close}
            </Text>
          </View>

          <Text numberOfLines={2} style={styles.shopTagline}>
            {shop.titleMsg}
          </Text>
        </View>
      </View>

      {/* Category pills */}
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
      <View style={styles.productColumn}>
        <ProductCard
          product={item}
          selectedCat={selectedCat as TCategory}
          goToProductScreen={goToProductScreen}
          isFavorite={isInWishList}
          onChatPress={() => onChatPress(shop)}
          // cardWidth={CARD_WIDTH}
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
        columnWrapperStyle={styles.productsWrapper}
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
    color: Theme.colors.gray,
    marginLeft: 6,
  },
  shopTagline: {
    ...Theme.typography.body2,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.xs,
  },
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
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  productColumn: {
    width: CARD_WIDTH,
    marginBottom: Theme.spacing.lg,
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
});

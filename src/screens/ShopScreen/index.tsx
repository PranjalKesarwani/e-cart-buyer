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
          <Icons name="left" size={24} color={Theme.colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.shopTitle}>{shop.shopName}</Text>
      </View>

      {/* Main Content */}
      <FlatList
        data={products}
        numColumns={2}
        ListHeaderComponent={
          <>
            {/* Shop Info Section */}
            <View style={styles.shopInfoContainer}>
              <View style={styles.shopImageContainer}>
                <Image
                  source={{
                    uri: shop?.shopPic || Theme.defaultImages.shop,
                  }}
                  style={styles.shopImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlayIcon}>
                  <Icons name="hearto" size={20} color={Theme.colors.white} />
                </View>
                <TouchableOpacity
                  onPress={() => onChatPress(shop)}
                  style={styles.imageOverlayIcon}>
                  <Icons name="message1" size={20} color={Theme.colors.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Icons
                    name="clockcircleo"
                    size={16}
                    color={Theme.colors.warning}
                  />
                  <Text style={styles.infoText}>
                    {shop.shopTiming.open} - {shop.shopTiming.close}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icons
                    name="enviromento"
                    size={16}
                    color={Theme.colors.success}
                  />
                  <Text style={styles.infoText}>
                    {(shop.sellerId as TSeller)?.address?.street ?? 'N/A'},{' '}
                    {(shop.sellerId as TSeller)?.address?.city ?? 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icons name="play" size={16} color={Theme.colors.primary} />
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
                    styles.categoryButton,
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
              nestedScrollEnabled
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
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  backButton: {
    marginRight: Theme.spacing.sm,
  },
  shopTitle: {
    ...Theme.typography.h5,
    color: Theme.colors.darkText,
    flex: 1,
    paddingLeft: Theme.spacing.xs,
  },
  shopInfoContainer: {
    backgroundColor: Theme.colors.white,
    marginBottom: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  shopImageContainer: {
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: Theme.borderRadius.lg,
    borderBottomRightRadius: Theme.borderRadius.lg,
  },
  imageOverlayIcon: {
    position: 'absolute',
    backgroundColor: Theme.colors.overlay,
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    zIndex: 1,
  },
  infoContainer: {
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  infoText: {
    ...Theme.typography.body2,
    color: Theme.colors.gray,
    marginLeft: Theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
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
  },
  categoriesContainer: {
    paddingVertical: Theme.spacing.sm,
    paddingLeft: Theme.spacing.sm,
  },
});

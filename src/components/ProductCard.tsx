import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {TCategory, TProduct} from '../types';
import {manageWishList} from '../utils/helper';
import {useAppDispatch} from '../redux/hooks';
import {Theme} from '../theme/theme';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10;

interface ProductCardProps {
  product: TProduct;
  selectedCat: TCategory;
  goToProductScreen: (product: TProduct, category: TCategory) => void;
  isFavorite?: boolean;
  toggleFavorite?: () => void;
  onChatPress?: () => void;
  cardWidth?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedCat,
  goToProductScreen,
  isFavorite,
  onChatPress,
  cardWidth,
}) => {
  const dispatch = useAppDispatch();

  // defensive guards
  const mrp = Number(product.productMrp ?? 0);
  const price = Number(product.price ?? 0);

  const showDiscount = mrp > 0 && price < mrp;
  const discountPercent = showDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  const formattedMrp = `₹${mrp.toLocaleString('en-IN')}`;

  const imageUri =
    product?.media?.images && product.media.images.length > 0
      ? product.media.images[0]
      : undefined;

  return (
    <View style={[styles.productCard, {width: cardWidth ?? CARD_WIDTH}]}>
      {/* Heart icon at top right */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => manageWishList(product._id, !isFavorite, dispatch)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Icons
          name="heart"
          size={20}
          color={isFavorite ? '#ff3f6c' : '#94969f'}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Main content */}
      <TouchableOpacity
        onPress={() => goToProductScreen(product, selectedCat!)}
        activeOpacity={0.9}>
        <Image
          source={{uri: imageUri || Theme.defaultImages.product}}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.productName}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.productShortDescription}
          </Text>

          {/* PRICE ROW: Price (left) + optional slashed MRP (right) */}
          <View style={[styles.priceRow]}>
            <Text style={styles.productPrice}>{formattedPrice}</Text>

            {showDiscount ? (
              <Text style={styles.originalPrice} numberOfLines={1}>
                {formattedMrp}
              </Text>
            ) : null}
          </View>

          {/* DISCOUNT TAG BELOW (only when there's a discount) */}
          {showDiscount ? (
            <View style={styles.discountRow}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Chat icon at bottom right */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={onChatPress}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Icons name="message1" size={20} color="#94969f" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Theme.colors.lightGray,
  },
  productDetails: {
    paddingHorizontal: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.darkText,
  },
  productDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Theme.colors.gray,
    marginVertical: 6,
    lineHeight: 16,
  },

  /* PRICE ROW */
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary || '#2A59FE',
  },
  originalPrice: {
    fontSize: 12,
    color: '#7e808c',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },

  /* DISCOUNT ROW (below price & mrp) */
  discountRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },

  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  chatButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default ProductCard;

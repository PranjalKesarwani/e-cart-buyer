import React, {useEffect, useState} from 'react';
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
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedCat,
  goToProductScreen,
  isFavorite,
  // toggleFavorite,
  onChatPress,
}) => {
  const dispatch = useAppDispatch();

  const mrp = Number(product.productMrp ?? 0);
  const price = Number(product.price ?? 0);

  const showDiscount = mrp > 0 && price < mrp;
  const discountPercent = showDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  const formattedMrp = `₹${mrp.toLocaleString('en-IN')}`;
  return (
    <View style={styles.productCard}>
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
          source={{uri: product.media.images[0]}}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={[styles.productDetails]}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.productName}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.productShortDescription}
          </Text>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.productPrice}>
              ₹{product.price.toLocaleString()}
            </Text>
            {product.price < product.productMrp && (
              <>
                <Text style={styles.originalPrice}> ₹{product.productMrp}</Text>
                <Text style={styles.discount}>
                  {' '}
                  {product.discountPercentage}% off
                </Text>
              </>
            )}
          </View>
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
    // marginBottom: 8,
    // marginVertical: 4,
    // height: 40,
  },
  productDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Theme.colors.gray,
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A59FE',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chatButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#7e808c',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discount: {
    fontSize: 18,
    color: '#26a541',
  },
});

export default ProductCard;

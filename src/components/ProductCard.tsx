import React, {useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {Category, Product} from '../types';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl: string;
//   rating: number;
// }

// interface ProductCardProps {
//   product: Product;
//   onAddToCart: (productId: string) => void;
// }
const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10;
const ProductCard: React.FC<any> = ({
  product,
  selectedCat,
  goToProductScreen,
}: {
  product: Product;
  selectedCat: Category;
  goToProductScreen: any;
}) => {
  const renderRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{product.rating}</Text>
        <Text style={styles.ratingStar}>★</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => goToProductScreen(product, selectedCat!)}>
      <Image
        source={{uri: product.media.images[0]}}
        style={styles.productImage}
        resizeMode="cover"
      />

      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.productName}
        </Text>
        <Text style={styles.productPrice}>
          ₹{product.price.toLocaleString()}
        </Text>
        <View style={styles.ratingContainer}>
          <Icons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {product.rating?.toFixed(1) || '4.5'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    width: 160,
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
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    height: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A59FE',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginRight: 4,
    color: '#666',
  },
  ratingStar: {
    color: '#FFD700',
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: '#2A59FE',
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProductCard;

import React from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<any> = ({product, onAddToCart}: any) => {
  const renderRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        <Text style={styles.ratingStar}>★</Text>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <Image
        source={{uri: product.imageUrl}}
        style={styles.productImage}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          {renderRating()}
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => onAddToCart(product.id)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailsContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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

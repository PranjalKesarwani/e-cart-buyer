import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {RootStackParamList, TWishlist} from '../../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

type WishListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WishListScreen'
>;

const paginatedItems: TWishlist[] = [
  {
    _id: '67e57f9dd5ae55730c8bb6db',
    addedAt: 1743093661,
    productId: {
      media: {
        images: [
          'https://i.pinimg.com/236x/26/be/56/26be56634ad9773c9d8f6315cac2cba7.jpg',
          'https://i.pinimg.com/236x/26/be/56/26be56634ad9773c9d8f6315cac2cba7.jpg',
        ],
        videos: [],
      },
      _id: '61e57f9dd5ae55730c8bb6db',
      sellerId: '61e57f9dd5ae55730c8bb6db',
      shopId: '61e57f9dd5ae55730c8bb6db',
      productName: 'Apple iPhone 15 Pro Max',
      price: 159999,
      productMrp: 200000,
      discountPercentage: 24,
      attributes: {
        color: 'Titanium Gray',
        storage: '256GB',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
      },
      deliveryOptions: {
        standard: '4-6 days',
      },
      variants: [
        {
          sku: 'MOB-APL-IP15PM-BLU-512GB',
          attributes: {color: 'Blue Titanium', storage: '512GB'},
          priceOffset: 10000,
          stock: 15,
        },
      ],
    },
  },
  {
    _id: '67e453173f3480ad9ce94d3e',
    addedAt: 1743016727,
    productId: {
      media: {
        images: [
          'https://i.pinimg.com/236x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg',
          'https://i.pinimg.com/236x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg',
        ],
        videos: ['https://example.com/videos/samsung_s23_ultra.mp4'],
      },
      productName: 'Samsung Galaxy S23 Ultra',
      price: 129999,
      productMrp: 200000,
      discountPercentage: 24,
      attributes: {
        color: 'Phantom Black',
        storage: '256GB',
        brand: 'Samsung',
        model: 'Galaxy S23 Ultra',
      },
      deliveryOptions: {
        standard: '5-7 days',
      },
      variants: [
        {
          sku: 'MOB-SAMS-S23U-GRN-512GB',
          attributes: {color: 'Green', storage: '512GB'},
          priceOffset: 5000,
          stock: 10,
        },
      ],
    },
  },
];

const WishListScreen = ({navigation}: WishListScreenProps) => {
  // Sample data structure mapping
  const wishlistItems = paginatedItems.map(item => ({
    id: item._id,
    image: item.productId.media.images[0],
    name: item.productId.productName,
    price: item.productId.price,
    mrp: item.productId.productMrp,
    discount: item.productId.discountPercentage,
    attributes: item.productId.attributes,
    delivery: item.productId.deliveryOptions?.standard,
    variants: item.productId.variants?.length,
  }));

  const renderItem = ({item}: {item: (typeof wishlistItems)[0]}) => (
    <Animated.View style={styles.card}>
      <Image source={{uri: item.image}} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.attributeContainer}>
          <Text style={styles.attributeText}>{item.attributes.color}</Text>
          <Text style={styles.attributeText}>{item.attributes.storage}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            ₹{item.price.toLocaleString()}
          </Text>
          <Text style={styles.originalPrice}>₹{item.mrp.toLocaleString()}</Text>
          <Text style={styles.discountTag}>{item.discount}% off</Text>
        </View>

        <Text style={styles.deliveryText}>Delivery {item.delivery}</Text>

        {item.variants && item.variants > 0 && (
          <TouchableOpacity style={styles.variantButton}>
            <Text style={styles.variantText}>{item.variants}+ Options</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="delete-outline" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={() => navigation.navigate('CartScreen')}>
          <Ionicons name="cart-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My Wishlist ({wishlistItems.length})
        </Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="favorite-border" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Save items you love for later
            </Text>
          </View>
        }
      />

      {wishlistItems.length > 0 && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('CartScreen')}>
            <Text style={styles.footerButtonText}>Add All to Cart</Text>
            <Text style={styles.footerPriceText}>
              ₹
              {wishlistItems
                .reduce((sum, item) => sum + item.price, 0)
                .toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2A2A',
    fontFamily: 'Roboto-Medium',
  },
  editButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2A2A',
    marginBottom: 8,
    lineHeight: 22,
  },
  attributeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  attributeText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  originalPrice: {
    fontSize: 13,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  discountTag: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  deliveryText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  variantButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  variantText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  actionButtons: {
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  cartButton: {
    backgroundColor: '#E8F0FE',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF2',
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  footerButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footerPriceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WishListScreen;

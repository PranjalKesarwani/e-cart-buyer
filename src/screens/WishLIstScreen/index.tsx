import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
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
import {RootStackParamList, TProduct, TWishlist} from '../../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch} from '../../redux/hooks';
import {getWishlists} from '../../redux/slices/buyerSlice';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import {manageCart} from '../../utils/helper';

type WishListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WishListScreen'
>;

const WishListScreen = ({navigation}: WishListScreenProps) => {
  // Sample data structure mapping
  const dispatch = useAppDispatch();
  const [wishlist, setWishList] = useState<[] | TWishlist[]>([]);

  const renderItem = ({item}: {item: TWishlist}) => (
    <Animated.View style={styles.card}>
      <Image
        source={{uri: item.productId.media.images[0]}}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productId.productName}
        </Text>
        <View style={styles.attributeContainer}>
          {Object.entries(item.productId.attributes)
            .slice(0, 4)
            .map(([key, value], index) => (
              <Text
                key={index}
                style={styles.attributeText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {`${value}`}
              </Text>
            ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            ₹{item.productId.price.toLocaleString()}
          </Text>
          <Text style={styles.originalPrice}>
            ₹{item.productId.productMrp.toLocaleString()}
          </Text>
          <Text style={styles.discountTag}>
            {item.productId.discountPercentage}% off
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="delete-outline" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={() => {
            manageCart(item.productId._id, 'ADD');
            // navigation.navigate('CartScreen');
          }}>
          <Ionicons name="cart-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data: any = await dispatch(getWishlists()).unwrap();
        if (data.success) {
          setWishList(data.paginatedItems);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist ({wishlist.length})</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={[styles.listContent]}
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

      {wishlist.length > 0 && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('CartScreen')}>
            <Text style={styles.footerButtonText}>Add All to Cart</Text>
            <Text style={styles.footerPriceText}>
              ₹
              {wishlist
                .reduce((sum, item) => sum + item.productId.price, 0)
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
    paddingBottom: 80,
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
    flexWrap: 'wrap',
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

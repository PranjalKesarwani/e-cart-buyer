import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {RootStackParamList, TCart, TCartItem, TProduct} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {getCarts, setSelectedCart} from '../../redux/slices/buyerSlice';
import {useFocusEffect} from '@react-navigation/native';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({navigation}: CartScreenProps) => {
  const dispatch = useAppDispatch();
  const {cart} = useAppSelector(state => state.buyer);
  const {width} = Dimensions.get('window');
  const cardWidth = width * 0.9;

  // 🔥 Efficiently calculate total only when cart changes
  const total = useMemo(() => {
    return cart.reduce((sum, cartItem) => {
      return (
        sum +
        cartItem.items.reduce(
          (acc, item) =>
            acc + item.quantity * Number((item.productId as TProduct).price),
          0,
        )
      );
    }, 0);
  }, [cart]);

  // 🏎️ Fetch cart only when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getCarts());
    }, [dispatch]),
  );

  // 🚀 Navigate to Order Details
  const goToCartDetail = (cart: TCart) => {
    dispatch(setSelectedCart(cart));
    navigation.navigate('OrderDetailsScreen');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={24} color="#2A2A2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {cart.map((cart: TCart, index) => (
          <View
            key={index}
            style={[styles.card, {width: cardWidth}]}
            accessible
            accessibilityLabel={`Cart items from ${cart.shopId.shopName}`}>
            <View style={styles.shopHeader}>
              <MaterialIcons
                name="storefront"
                size={20}
                color="#4A90E2"
                style={styles.storeIcon}
              />
              <Text style={styles.shopName}>{cart.shopId.shopName}</Text>
            </View>

            <View style={styles.itemsContainer}>
              {cart.items
                .slice(0, 2)
                .map((item: TCartItem, itemIndex: number) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <View style={styles.bullet} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>
                        {(item.productId as TProduct).productName}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {(item.productId as TProduct).currency}
                        {(item.productId as TProduct).price}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>

            <TouchableOpacity
              onPress={() => goToCartDetail(cart)}
              style={styles.detailsButton}
              activeOpacity={0.8}>
              <Text style={styles.detailsButtonText}>View Order Details</Text>
              <Icons
                name="arrowright"
                size={20}
                color="#4A90E2"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={[styles.totalCard, {width: cardWidth}]}>
          <Text style={styles.totalText}>Estimated Total</Text>
          <Text style={styles.totalPrice}>₹ {total}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2A2A',
    fontFamily: 'Roboto-Medium',
  },
  headerRight: {
    width: 40,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    paddingBottom: 12,
  },
  storeIcon: {
    marginRight: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2A2A2A',
    fontFamily: 'Roboto-Medium',
  },
  itemsContainer: {
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#4F4F4F',
    flex: 1,
    marginRight: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2A2A',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF2',
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90E2',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  totalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  totalText: {
    fontSize: 18,
    color: '#4F4F4F',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2A2A',
  },
});

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {RootStackParamList, TCart, TProduct} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {manageCart, manageWishList} from '../../utils/helper';
import {Theme} from '../../theme/theme';
import {useFocusEffect} from '@react-navigation/native';
import {getCarts, setSelectedCart} from '../../redux/slices/buyerSlice';
import {Dispatch} from '@reduxjs/toolkit';

type OrderDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderDetailsScreen'
>;

const {width} = Dimensions.get('window');

const OrderDetailsScreen = ({navigation}: OrderDetailsScreenProps) => {
  const {selectedCart} = useAppSelector(state => state.buyer);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryCharge] = useState(40);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const dispatch = useAppDispatch();

  const calculatePrices = () => {
    let sum = 0;
    let savings = 0;
    selectedCart?.items?.forEach(item => {
      const product = item.productId as TProduct;
      sum += product.price * item.quantity;
      savings += (product.productMrp - product.price) * item.quantity;
    });
    setTotalPrice(sum + deliveryCharge);
    setTotalSavings(savings);
  };

  useEffect(() => {
    if (selectedCart) {
      calculatePrices();
    }
  }, [selectedCart]);

  const handleCart = async (
    productId: string,
    action: string,
    quantity: number,
    dispatch: Dispatch,
  ) => {
    const newCarts = await manageCart(productId, action, quantity, dispatch);
    const newCart = newCarts.cart.find(
      (cartData: TCart) => cartData._id === selectedCart?._id,
    );
    dispatch(setSelectedCart(newCart));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={24} color="#2A2A2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.storeCard}>
          <MaterialIcons name="storefront" size={24} color="#2874F0" />
          <Text style={styles.storeName}>{selectedCart?.shopId.shopName}</Text>
        </View>

        <View style={styles.itemsCard}>
          {selectedCart?.items.map((item, index) => {
            const product = item.productId as TProduct;
            const discount = Math.round(
              ((product.productMrp - product.price) / product.productMrp) * 100,
            );

            return (
              <View key={index} style={styles.itemContainer}>
                <Image
                  source={{uri: product.media.images[0]}}
                  style={styles.productImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.productName}
                  </Text>

                  <View style={styles.priceContainer}>
                    <Text style={styles.sellingPrice}>₹{product.price}</Text>
                    <Text style={styles.originalPrice}>
                      ₹{product.productMrp}
                    </Text>
                    <Text style={styles.discount}>{discount}% off</Text>
                  </View>

                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleCart(
                          (item.productId as TProduct)._id,
                          'REMOVE',
                          1,
                          dispatch,
                        )
                      }
                      style={styles.actionButton}>
                      <MaterialIcons
                        name="delete-outline"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.priceBreakdownCard}>
          <Text style={styles.breakdownTitle}>PRICE DETAILS</Text>

          <View style={styles.breakdownRow}>
            <Text>Total MRP</Text>
            <Text>
              ₹
              {selectedCart?.items.reduce(
                (acc, item) =>
                  acc + (item.productId as TProduct).productMrp * item.quantity,
                0,
              )}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text>Total Discount</Text>
            <Text style={styles.discountText}>- ₹{totalSavings}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text>Delivery Charges</Text>
            <Text style={styles.deliveryText}>
              {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
          </View>
        </View>

        <Text style={styles.savingsText}>
          You will save ₹{totalSavings} on this order
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.proceedButton}
        onPress={() => navigation.navigate('AddressScreen')}
        activeOpacity={0.9}>
        <Text style={styles.proceedButtonText}>Continue</Text>
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  actionButton: {
    justifyContent: 'space-between',
    marginLeft: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 4,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2A2A2A',
    marginLeft: 12,
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: '#2A2A2A',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: '#878787',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#878787',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#2A2A2A',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#2A2A2A',
  },
  priceBreakdownCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discountText: {
    color: '#388E3C',
  },
  deliveryText: {
    color: '#388E3C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  savingsText: {
    color: '#388E3C',
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.mainOrange,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OrderDetailsScreen;

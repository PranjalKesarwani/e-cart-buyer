import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {RootStackParamList, TProduct} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector} from '../../redux/hooks';

type OrderDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderDetailsScreen'
>;

const OrderDetailsScreen = ({navigation}: OrderDetailsScreenProps) => {
  const {selectedCart} = useAppSelector(state => state.buyer);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // const totalPrice = '₹1,970,000';
  const giveTotalPriceSum = () => {
    let sum = 0;
    selectedCart?.items?.forEach(item => {
      sum += (item.productId as TProduct).price * item.quantity;
    });
    setTotalPrice(sum);
  };

  useEffect(() => {
    if (selectedCart) {
      giveTotalPriceSum();
    }
  }, []);

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
        <View style={styles.storeHeader}>
          <MaterialIcons name="storefront" size={24} color="#4A90E2" />
          <Text style={styles.storeName}>{selectedCart?.shopId.shopName}</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.itemColumn]}>Item</Text>
            <Text style={[styles.headerCell, styles.qtyColumn]}>Qty</Text>
            <Text style={[styles.headerCell, styles.amountColumn]}>Amount</Text>
          </View>

          {selectedCart?.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[styles.rowCell, styles.itemColumn]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {(item.productId as TProduct).productName}
              </Text>
              <Text style={[styles.rowCell, styles.qtyColumn]}>
                {item.quantity}
              </Text>
              <View style={[styles.amountColumn, styles.priceContainer]}>
                <View style={styles.priceComparison}>
                  <Text style={styles.originalPrice}>
                    {(item.productId as TProduct).currency}
                    {(item.productId as TProduct).productMrp}
                  </Text>
                  {/* <View style={styles.dashLine} /> */}
                </View>
                <Text style={styles.sellingPrice}>
                  {(item.productId as TProduct).currency}
                  {(item.productId as TProduct).price}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.proceedButton}
        onPress={() => navigation.navigate('AddressScreen')}
        activeOpacity={0.9}>
        <Text style={styles.proceedButtonText}>Proceed to Shipping</Text>
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;

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
    padding: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2A2A2A',
    marginLeft: 12,
    fontFamily: 'Roboto-Medium',
  },
  amountCell: {
    fontWeight: '500',
    color: '#2A2A2A',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF2',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F4F4F',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  proceedButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 18,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#1F2D3D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  priceColumn: {
    flex: 1.2,
    textAlign: 'right',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rowCell: {
    fontSize: 14, // Slightly reduced size
    color: '#2A2A2A',
    paddingHorizontal: 4, // Added cell padding
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    marginBottom: 8,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F4F4F',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  itemColumn: {
    flex: 4,
    paddingRight: 12,
  },
  qtyColumn: {
    flex: 0.8,
    textAlign: 'center',
  },
  amountColumn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  priceContainer: {
    justifyContent: 'space-between',
    height: 40, // Fixed height for price alignment
  },
  priceComparison: {
    position: 'relative',
    marginBottom: 4,
    color: 'black',
  },
  originalPrice: {
    fontSize: 12,
    color: 'red',
    textDecorationLine: 'line-through',
  },
  dashLine: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: 1,
    backgroundColor: '#EF4444',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  sellingPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
});

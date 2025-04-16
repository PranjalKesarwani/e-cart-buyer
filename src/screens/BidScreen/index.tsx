import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  MainTabsParamList,
  RootStackParamList,
  TCartItem,
  TProduct,
} from '../../types';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../../theme/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Mock data for shops
const shopData = [
  {
    id: '1',
    shopName: 'Om Prakash General Store',
    items: [
      'Samsung 657L Side-by-Side Refrigerator',
      'LG 8kg Front Load Washing Machine',
      'Whirlpool 1.5 Ton 5 Star Inverter Split AC',
    ],
  },
  {
    id: '2',
    shopName: 'Electronics World',
    items: ['Apple iPhone 15 Pro Max', 'Sony 65-inch 4K OLED Smart TV'],
  },

  // Add more shops as needed
];

type BidScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Bid'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BidScreen = ({navigation}: BidScreenProps) => {
  const {width} = Dimensions.get('window');
  const cardWidth = width * 0.9;
  const renderItem = ({item}: {item: (typeof shopData)[0]}) => (
    <View
      key={'321423'}
      style={[styles.card, {width: cardWidth}, Theme.showBorder]}
      accessible
      accessibilityLabel={`Cart items from Om Prakash general store`}>
      <View style={styles.shopHeader}>
        <MaterialIcons
          name="storefront"
          size={20}
          color="#4A90E2"
          style={styles.storeIcon}
        />
        <Text style={styles.shopName}>Om Prakash General Store</Text>
      </View>

      <View style={styles.itemsContainer}>
        {/* {cart.items
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
                      ))} */}
        <View key={'1234'} style={styles.itemRow}>
          <View style={styles.bullet} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>Product name 1</Text>
            <Text style={styles.itemPrice}>₹ 500</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => console.log('clicked for going to next stage')}
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shopData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  // detailsButton: {
  //   backgroundColor: '#007bff',
  //   borderRadius: 4,
  //   paddingVertical: 10,
  //   alignItems: 'center',
  // },

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
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    paddingBottom: 12,
  },
});

export default BidScreen;

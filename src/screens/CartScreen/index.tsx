import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Product, RootStackParamList} from '../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/AntDesign';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'CartScreen'>;

const CartScreen = ({navigation}: CartScreenProps) => {
  const shops = Array(20).fill({
    name: 'Prakash Watch Center',
    items: ['Watch 1', 'Watch 2', 'Watch 3'],
  });
  const dimension = Dimensions.get('window').width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {shops.map((shop, index) => (
        <View key={index} style={[styles.card, {width: dimension * 0.9}]}>
          <Text style={styles.shopName}>{shop.name}</Text>
          {shop.items.map((item: any, itemIndex: number) => (
            <Text key={itemIndex} style={styles.itemText}>
              {item}
            </Text>
          ))}
          <TouchableOpacity
            onPress={() => navigation.navigate('OrderDetailsScreen')}
            style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Go to details </Text>
            <Icons name="right" size={20} color={'black'} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 2,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  detailsButtonText: {
    fontSize: 16,
    marginRight: 5,
  },
});

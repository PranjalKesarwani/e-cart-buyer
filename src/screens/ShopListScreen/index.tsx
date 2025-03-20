import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import Title from '../../components/Title';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {showToast} from '../../utils/toast';
import {apiClient, request} from '../../services/api';

type ShopListProps = NativeStackScreenProps<
  RootStackParamList,
  'ShopListScreen'
>;

const ShopListScreen = ({route, navigation}: ShopListProps) => {
  const {category}: any = route.params;
  const [shops, setShops] = useState<any>([]);

  const getShops = async () => {
    try {
      const res = await apiClient.get(
        `/buyer/categories/${category.slug}/shops`,
      );

      if (!res?.data.success) throw new Error(res?.data.message);

      setShops(res.data.shops);
    } catch (error: any) {
      console.log('error', error.message);
      showToast('error', error.message);
    }
  };

  const goToShopScreen = (shop: any) => {
    navigation.navigate('ShopScreen', {shop});
  };

  useEffect(() => {
    getShops();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {/* Navigation / Back Button */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={20} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        stickyHeaderIndices={[1]}
        contentContainerStyle={{flexGrow: 1}}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{category.name}</Text>
        </View>

        {/* Shop List Section */}
        <View style={styles.shopListContainer}>
          {Array.isArray(shops) && shops.length > 0 ? (
            shops.map((shop, index) => (
              <TouchableOpacity
                key={index}
                style={styles.shopCard}
                onPress={() => goToShopScreen(shop)}>
                <View style={styles.shopImageContainer}>
                  <Image
                    source={{uri: shop.shopPic}}
                    style={styles.shopImage}
                  />
                </View>
                <Text style={styles.shopName}>{shop.shopName}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noShopsText}>No shops found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopListScreen;
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
  },
  shopListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  shopCard: {
    backgroundColor: '#fff',
    width: '48%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  shopImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  shopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  noShopsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
});

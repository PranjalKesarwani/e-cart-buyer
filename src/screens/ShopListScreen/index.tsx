import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
    <View style={{flex: 1}}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={17} color={'black'} />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={styles.container}>
          <Text style={{fontSize: 20}}>{category.name}</Text>
        </View>
        <View style={styles.shopListContainer}>
          {Array.isArray(shops) && shops.length > 0 ? (
            shops.map((shop: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.shopCard}
                onPress={() => goToShopScreen(shop)}>
                <Text style={styles.shopName}>{shop.shopName}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No shops found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    padding: 20,
    width: '100%',
  },
  navContainer: {
    width: '100%',
  },
  backButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopListContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopCard: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '100%',
    minHeight: 200,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 3,
  },
  subHeaderText: {
    fontSize: 12,
  },
});

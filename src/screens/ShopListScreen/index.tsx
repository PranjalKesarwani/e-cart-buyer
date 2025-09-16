import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, TShop} from '../../types';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import {setSelectedShop} from '../../redux/slices/buyerSlice';
import {useDispatch} from 'react-redux';
import ShopCard from './ShopCard';

type ShopListProps = NativeStackScreenProps<
  RootStackParamList,
  'ShopListScreen'
>;

const {width} = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = width - 30 - CARD_MARGIN; // 15 padding on each side

const ShopListScreen = ({route, navigation}: ShopListProps) => {
  const {category}: any = route.params;
  const [shops, setShops] = useState<TShop[]>([]);
  const dispatch = useDispatch();

  const getShops = async () => {
    try {
      const res = await apiClient.get(
        `/buyer/categories/${category.slug}/shops`,
      );
      setShops(res.data.shops || []);
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const goToShopScreen = (shop: TShop) => {
    dispatch(setSelectedShop(shop));
    navigation.navigate('ShopScreen', {shop});
  };

  useEffect(() => {
    getShops();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {/* Navigation Header */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icons name="left" size={20} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        ListHeaderComponent={
          <View style={[styles.headerContainer]}>
            <Text style={[styles.headerTitle, {textAlign: 'center'}]}>
              {category.name}
            </Text>
          </View>
        }
        stickyHeaderIndices={[0]}
        data={shops}
        renderItem={({item}) => <ShopCard item={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        ListEmptyComponent={
          <Text style={styles.noShopsText}>No shops found.</Text>
        }
        contentContainerStyle={[styles.shopListContainer]}
        // columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    backgroundColor: '#fff',
    padding: 15,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    // textAlign: 'center',
  },
  noShopsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    fontFamily: 'System', // Use your custom font if available
  },
  shopListContainer: {
    paddingHorizontal: 16, // horizontal gutter for full-width cards
    paddingTop: 12,
    flexGrow: 1,
    paddingBottom: 32,
  },
});

export default ShopListScreen;

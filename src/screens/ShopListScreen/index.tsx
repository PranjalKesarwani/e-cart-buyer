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
import ShopList from '../../components/common/ShopList';
import {goBack, navigate} from '../../navigation/navigationService';
import Header from '../../components/common/Header';

type ShopListProps = NativeStackScreenProps<
  RootStackParamList,
  'ShopListScreen'
>;
type ShopListHeaderProps = {
  title: string;
  subtitle?: string; // optional if you want to extend later
};

const ShopListHeader: React.FC<ShopListHeaderProps> = ({title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

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

      <Header title="Your Shops" onBack={() => goBack()} />

      {/* Main Content */}

      <ShopList
        endpoint={`/buyer/categories/${category.slug}/shops`}
        queryParams={{}}
        pageSize={12}
        ListHeaderComponent={
          <ShopListHeader title={category.name} subtitle="Top Picks for You" />
        }
        onShopPress={shop => navigate('ShopScreen', {shop})}
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
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ShopListScreen;

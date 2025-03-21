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
import {RootStackParamList} from '../../types';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';

type ShopListProps = NativeStackScreenProps<
  RootStackParamList,
  'ShopListScreen'
>;

const {width} = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = width - 30 - CARD_MARGIN; // 15 padding on each side

const ShopListScreen = ({route, navigation}: ShopListProps) => {
  const {category}: any = route.params;
  const [shops, setShops] = useState<any>([]);

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

  const goToShopScreen = (shop: any) => {
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
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{category.name}</Text>
          </View>
        }
        stickyHeaderIndices={[0]}
        data={shops}
        style={[]}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.shopCard, {width: CARD_WIDTH}]}
            onPress={() => goToShopScreen(item)}>
            {/* Image Container with Distance Badge */}
            <View style={styles.shopImageContainer}>
              <Image
                resizeMode="cover"
                source={{uri: item.shopPic}}
                style={styles.shopImage}
              />
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>4 km</Text>
              </View>
            </View>

            {/* Shop Info Container */}
            <View style={styles.shopInfoContainer}>
              <Text style={styles.shopName} numberOfLines={1}>
                {item.shopName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        ListEmptyComponent={
          <Text style={styles.noShopsText}>No shops found.</Text>
        }
        contentContainerStyle={[styles.shopListContainer]}
        columnWrapperStyle={{justifyContent: 'space-between'}}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  shopListContainer: {
    padding: 15,
    flexGrow: 1,
  },
  shopCard: {
    backgroundColor: '#fff',
    marginBottom: CARD_MARGIN,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  shopImageContainer: {
    width: '100%',
    height: 160, // Adjust based on your needs
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanceText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  shopInfoContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  noShopsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShopListScreen;

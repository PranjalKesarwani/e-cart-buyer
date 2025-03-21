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
          <View style={[styles.headerContainer]}>
            <Text style={[styles.headerTitle, {textAlign: 'center'}]}>
              {category.name}
            </Text>
          </View>
        }
        stickyHeaderIndices={[0]}
        data={shops}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.shopCard, {width: CARD_WIDTH}]}
            onPress={() => goToShopScreen(item)}
            activeOpacity={0.9}>
            {/* Image Container */}
            <View style={styles.shopImageContainer}>
              <Image
                resizeMode="cover"
                source={{uri: item.shopPic}}
                style={styles.shopImage}
              />

              {/* Top Badges */}
              <View style={styles.topBadgeContainer}>
                <View style={styles.distanceBadge}>
                  <Icons name="enviromento" size={14} color="#fff" />
                  <Text style={styles.distanceText}>4 km</Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Icons name="hearto" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Shop Info */}
            <View style={styles.shopInfoContainer}>
              <View>
                <Text style={styles.shopName} numberOfLines={1}>
                  {item.shopName}
                </Text>
                <View style={styles.ratingContainer}>
                  <Icons name="star" size={14} color="#FFC107" />
                  <Text style={styles.ratingText}>4.8</Text>
                  <Text style={styles.ratingCount}>(238)</Text>
                </View>
                <Text style={styles.categoryTag}>Café • Bakery • ₪₪</Text>
              </View>
              <View style={styles.actionButton}>
                <Icons name="arrowright" size={20} color="#333" />
              </View>
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
    // textAlign: 'center',
  },
  noShopsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  shopCard: {
    backgroundColor: '#fff',
    marginBottom: CARD_MARGIN,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 16,
    transform: [{scale: 1}],
  },
  shopImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  topBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
  },
  shopInfoContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  shopName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  ratingCount: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  categoryTag: {
    fontSize: 13,
    color: '#666',
    letterSpacing: -0.2,
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    fontFamily: 'System', // Use your custom font if available
  },
  shopListContainer: {
    padding: 16,
    flexGrow: 1,
    paddingBottom: 32,
  },
});

export default ShopListScreen;

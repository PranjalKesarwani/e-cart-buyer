import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {Theme} from '../../theme/theme';
import {TSeller, TShop} from '../../types';
import {useAppDispatch} from '../../redux/hooks';
import {setSelectedShop} from '../../redux/slices/buyerSlice';
import {navigate} from '../../navigation/navigationService';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 14;
const CARD_WIDTH = width - 32; // consistent padding from screen edges

const ShopCard = ({item}: {item: TShop}) => {
  const dispatch = useAppDispatch();

  const goToShopScreen = () => {
    dispatch(setSelectedShop(item));
    navigate('ShopScreen', {shop: item});
  };

  return (
    <TouchableOpacity
      style={[styles.shopCard]}
      activeOpacity={0.92}
      onPress={() => goToShopScreen()}>
      {/* Image */}
      <View style={styles.shopImageContainer}>
        <Image source={{uri: item.shopPic}} style={styles.shopImage} />

        {/* Gradient overlay for readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.55)']}
          style={styles.imageOverlay}
        />

        {/* Distance + Favorite */}
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

      {/* Info */}
      <View style={styles.shopInfoContainer}>
        <View style={{flex: 1}}>
          {/* <Text style={styles.shopName} numberOfLines={1}>
            {item.shopName}
          </Text> */}
          <View style={styles.shopNameRow}>
            <Image
              source={{
                uri:
                  (item.sellerId as TSeller)?.profilePic ||
                  'https://i.pinimg.com/736x/16/18/20/1618201e616f4a40928c403f222d7562.jpg',
              }}
              style={styles.sellerAvatar}
            />
            <Text style={styles.shopName} numberOfLines={1}>
              {item.shopName}
            </Text>
          </View>
          <Text style={styles.shopDescription} numberOfLines={2}>
            {item.titleMsg || 'No description available'}
          </Text>
          <Text style={styles.shopDescription} numberOfLines={2}>
            {'Location details not found!'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => goToShopScreen()}
          style={styles.actionButton}>
          <Icons name="arrowright" size={20} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shopCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: CARD_MARGIN,
    overflow: 'hidden',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  shopImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    // ...StyleSheet.absoluteFillObject,
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 20,
  },
  shopInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  shopName: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  shopDescription: {
    fontSize: 13,
    color: Theme.colors.darkGray,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
});

export default ShopCard;

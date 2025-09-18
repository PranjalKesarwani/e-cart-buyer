import React, {useMemo, useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {TCategory, TProduct} from '../types';
import {manageWishList} from '../utils/helper';
import {useAppDispatch} from '../redux/hooks';
import {Theme} from '../theme/theme';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10;

interface ProductCardProps {
  product: TProduct;
  selectedCat: TCategory;
  goToProductScreen: (product: TProduct, category: TCategory) => void;
  isFavorite?: boolean;
  toggleFavorite?: () => void;
  onChatPress?: () => void;
  cardWidth?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedCat,
  goToProductScreen,
  isFavorite,
  onChatPress,
  cardWidth,
}) => {
  const dispatch = useAppDispatch();

  // defensive guards
  const mrp = Number(product.productMrp ?? 0);
  const price = Number(product.price ?? 0);

  const showDiscount = mrp > 0 && price < mrp;
  const discountPercent = showDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  const formattedMrp = `₹${mrp.toLocaleString('en-IN')}`;

  const imageUri =
    product?.media?.images && product.media.images.length > 0
      ? product.media.images[0]
      : undefined;

  // try common audio locations on product object (adjust if your schema differs)
  const audioUrl = useMemo(
    () =>
      product?.media?.voiceDescriptions?.length! > 0
        ? product.media.voiceDescriptions![0]
        : null,
    [product],
  );

  // UI-only play/pause state (no audio playback yet)
  const [isPlaying, setIsPlaying] = useState(false);

  // Animated pulse while "playing"
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;

    if (isPlaying) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      anim.start();
      // Announce to screen readers
      AccessibilityInfo.announceForAccessibility(
        `${product.productName} audio playing`,
      );
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
      AccessibilityInfo.announceForAccessibility(
        `${product.productName} audio paused`,
      );
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [isPlaying, pulseAnim, product.productName]);

  const togglePlay = () => {
    // purely UI state for now — wire to actual player later
    setIsPlaying(prev => !prev);
  };

  return (
    <View style={[styles.productCard, {width: cardWidth ?? CARD_WIDTH}]}>
      {/* Heart icon at top right */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => manageWishList(product._id, !isFavorite, dispatch)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        accessibilityLabel={
          isFavorite ? 'Remove from wishlist' : 'Add to wishlist'
        }>
        <Icons
          name="heart"
          size={20}
          color={isFavorite ? Theme.colors.red || '#ff3f6c' : '#94969f'}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Chat icon at bottom right */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={onChatPress}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        accessibilityLabel="Open chat with seller">
        <Icons name="message1" size={20} color="#94969f" style={styles.icon} />
      </TouchableOpacity>

      {/* Main content */}
      <TouchableOpacity
        onPress={() => goToProductScreen(product, selectedCat!)}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`Open product ${product.productName}`}>
        <Image
          source={{uri: imageUri || Theme.defaultImages.product}}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* PLAY CONTROL OVERLAY (bottom-left) */}

        <View style={styles.productDetails}>
          <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode="tail">
            {product.productName}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.productShortDescription}
          </Text>

          {/* PRICE ROW: Price (left) + optional slashed MRP (right) */}
          <View style={[styles.priceRow]}>
            <Text style={styles.productPrice}>{formattedPrice}</Text>

            {showDiscount ? (
              <Text style={styles.originalPrice} numberOfLines={1}>
                {formattedMrp}
              </Text>
            ) : null}
          </View>

          {/* DISCOUNT TAG BELOW (only when there's a discount) */}
          {showDiscount ? (
            <View style={styles.discountRow}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
            </View>
          ) : null}

          {audioUrl ? (
            <View
              style={[styles.audioOverlayContainer]}
              pointerEvents="box-none">
              <View style={styles.audioOverlay}>
                {/* Animated pulse behind icon */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.pulse,
                    {
                      opacity: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.25, 0.9],
                      }),
                      transform: [
                        {
                          scale: pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.6],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                <TouchableOpacity
                  onPress={togglePlay}
                  style={styles.playButton}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                  accessibilityLabel={isPlaying ? 'Pause audio' : 'Play audio'}
                  accessibilityRole="button">
                  <Icons
                    name={isPlaying ? 'pausecircle' : 'play'}
                    size={20}
                    color={isPlaying ? '#fff' : Theme.colors.primary}
                    style={{marginLeft: isPlaying ? 0 : 2}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

/* small helper to format seconds (if you store duration in seconds) */
const formatSeconds = (s: number) => {
  if (!s && s !== 0) return '';
  const minutes = Math.floor(s / 60);
  const seconds = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Theme.colors.lightGray,
  },
  productDetails: {
    paddingHorizontal: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.darkText,
  },
  productDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Theme.colors.gray,
    marginVertical: 6,
    lineHeight: 16,
  },

  /* PRICE ROW */
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary || '#2A59FE',
  },
  originalPrice: {
    fontSize: 12,
    color: '#7e808c',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },

  /* DISCOUNT ROW (below price & mrp) */
  discountRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },
  chatButton: {
    position: 'absolute',
    bottom: 12,
    right: 10,
    zIndex: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },

  /* Audio overlay */
  audioOverlayContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 3,
  },
  audioOverlay: {
    width: 'auto',
    height: 36,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  pulse: {
    position: 'absolute',
    left: 6,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    opacity: 0.25,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  audioDurationText: {
    marginLeft: 8,
    fontSize: 12,
    color: Theme.colors.gray,
    fontWeight: '600',
  },

  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default ProductCard;

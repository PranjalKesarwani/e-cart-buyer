import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken,
  Platform,
} from 'react-native';
import {Theme} from '../../theme/theme';

type Props = {
  banners: string[]; // list of image URLs
  height?: number; // height of carousel
  autoplayInterval?: number; // ms between auto-advances
  onBannerPress?: (url: string, index: number) => void;
  // optional: show/hide dots
  showDots?: boolean;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const DEFAULT_HEIGHT = 140;

export const BannerCarousel: React.FC<Props> = ({
  banners,
  height = DEFAULT_HEIGHT,
  autoplayInterval = 4000,
  onBannerPress,
  showDots = true,
}) => {
  const flatListRef = useRef<FlatList<string> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const viewableRef = useRef<{viewableItems: ViewToken[]}>({viewableItems: []});

  // When banners empty, render nothing
  if (!banners || banners.length === 0) return null;

  // Auto-play handler
  const startAutoplay = useCallback(() => {
    stopAutoplay(); // ensure single timer
    if (autoplayInterval <= 0) return;
    autoplayRef.current = setInterval(() => {
      // compute next index (loop)
      const next =
        (viewableRef.current.viewableItems[0]?.index ?? currentIndex) + 1;
      const toIndex = next >= banners.length ? 0 : next;
      flatListRef.current?.scrollToIndex({index: toIndex, animated: true});
      setCurrentIndex(toIndex);
    }, autoplayInterval);
  }, [autoplayInterval, banners.length, currentIndex]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayInterval, banners.length]);

  // Handle user swipes — update current index
  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems && viewableItems.length > 0) {
        const idx = viewableItems[0].index ?? 0;
        setCurrentIndex(idx);
        viewableRef.current.viewableItems = viewableItems;
      }
    },
  ).current;

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const onScrollBeginDrag = () => {
    // pause autoplay while user interacts
    stopAutoplay();
  };

  const onScrollEndDrag = () => {
    // resume autoplay after short delay
    startAutoplay();
  };

  const handleBannerPress = (url: string, index: number) => {
    onBannerPress?.(url, index);
  };

  const renderItem = useCallback(
    ({item, index}: {item: string; index: number}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleBannerPress(item, index)}
        style={{
          width: SCREEN_WIDTH,
          height,
          alignItems: 'center', // center horizontally
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: item}}
          style={{
            width: SCREEN_WIDTH - 30, // gives ~15px margin left/right
            height,
            resizeMode: 'cover',
            borderRadius: 12,
          }}
        />
      </TouchableOpacity>
    ),
    [handleBannerPress, height],
  );

  // For performance, provide getItemLayout
  const getItemLayout = useCallback(
    (_data: ArrayLike<string> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <View style={[styles.container, {height}]}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item, idx) => `${idx}-${item}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
          const offsetX = ev.nativeEvent.contentOffset.x;
          const idx = Math.round(offsetX / SCREEN_WIDTH);
          setCurrentIndex(idx);
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {showDots && (
        <View style={styles.dotsContainer}>
          {banners.map((_, i) => {
            const active = i === currentIndex;
            return (
              <View
                key={`dot-${i}`}
                style={[
                  styles.dot,
                  active ? styles.dotActive : styles.dotInactive,
                ]}
                accessible
                accessibilityLabel={`Banner ${i + 1} of ${banners.length}`}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 10 : 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 0,
  },
});

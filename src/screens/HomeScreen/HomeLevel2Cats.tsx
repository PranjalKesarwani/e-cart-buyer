import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../../theme/theme';

export type TCategory = {
  _id: string; // server returns _id, we'll use it as key
  name: string;
  image: string;
};

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

// tweak these sizes to taste
const IMAGE_SIZE_PREVIEW = 54; // smaller preview avatar
const IMAGE_SIZE_GRID = 48; // smaller grid avatars

// color used for the "See all" tile accent — change to Theme.colors.primary if you have a Theme import
const SEE_ALL_COLOR = '#ff6b6b';

type Props = {
  level2Cats: TCategory[];
  // number to show in the horizontal list before 'See all' button
  previewCount?: number; // default 12
  onCategoryPress?: (cat: TCategory) => void;
  activeCat?: string;
};

export const HomeLevel2Cats: React.FC<Props> = ({
  level2Cats,
  previewCount = 12,
  onCategoryPress,
  activeCat = '6855925dee70eda45ca5a1d4',
}) => {
  const [sheetVisible, setSheetVisible] = useState(false);
  const animatedY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openSheet = useCallback(() => {
    setSheetVisible(true);
    Animated.timing(animatedY, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [animatedY]);

  const closeSheet = useCallback(() => {
    Animated.timing(animatedY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  }, [animatedY]);

  // preview items + SEE_ALL sentinel appended so See All scrolls as last item
  const previewItems = useMemo(() => {
    const slice = level2Cats.slice(0, previewCount);
    // append a sentinel object for see-all
    return [...slice, {_id: 'SEE_ALL', name: 'See all', image: ''} as any];
  }, [level2Cats, previewCount]);

  const handlePress = useCallback(
    (item: TCategory) => {
      if (item._id === 'SEE_ALL') {
        openSheet();
        return;
      }
      onCategoryPress?.(item);
    },
    [onCategoryPress, openSheet],
  );

  const renderPreviewItem = useCallback(
    ({item}: {item: TCategory}) => {
      if (item._id === 'SEE_ALL') {
        return (
          <TouchableOpacity
            style={styles.previewItem}
            activeOpacity={0.85}
            onPress={() => handlePress(item)}
            accessibilityRole="button"
            accessibilityLabel="See all categories">
            <View
              style={[
                styles.seeAllCircle,
                {borderColor: `${SEE_ALL_COLOR}22`},
              ]}>
              {/* tile-style icon — replace with your icon component if you prefer */}
              <Icons
                name="plus"
                size={20}
                color={'#fff'}
                style={{fontWeight: 'bold'}}
              />
            </View>
            <Text numberOfLines={1} style={styles.previewText}>
              See all
            </Text>
          </TouchableOpacity>
        );
      }
      const isActive = !!activeCat && item._id === activeCat;

      return (
        <TouchableOpacity
          style={styles.previewItem}
          activeOpacity={0.8}
          onPress={() => handlePress(item)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.name} category`}>
          <Image source={{uri: item.image}} style={styles.previewImage} />
          <Text
            numberOfLines={1}
            style={[styles.previewText, isActive && styles.previewTextActive]}>
            {item.name}
          </Text>
          {isActive ? <View style={styles.activeIndicator} /> : null}
        </TouchableOpacity>
      );
    },
    [handlePress],
  );

  const keyExtractor = useCallback((item: TCategory) => item._id, []);

  const renderGridItem = useCallback(
    ({item}: {item: TCategory}) => (
      <TouchableOpacity
        style={styles.gridCell}
        activeOpacity={0.85}
        onPress={() => {
          closeSheet();
          onCategoryPress?.(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.name} category`}>
        <Image source={{uri: item.image}} style={styles.gridImage} />
        <Text style={styles.gridText} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [closeSheet, onCategoryPress],
  );

  return (
    <View style={styles.container}>
      {/* Horizontal preview list (See all is part of data so it scrolls to the end) */}
      <View style={styles.horizontalWrap}>
        <FlatList
          data={previewItems}
          keyExtractor={keyExtractor}
          renderItem={renderPreviewItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          ItemSeparatorComponent={() => <View style={{width: 8}} />}
          // small optimization
          initialNumToRender={Math.min(previewItems.length, 6)}
          maxToRenderPerBatch={8}
          windowSize={5}
        />
      </View>

      {/* Bottom sheet Modal */}
      <Modal
        visible={sheetVisible}
        animationType="none"
        transparent
        onRequestClose={closeSheet}
        statusBarTranslucent>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={closeSheet} />

        {/* Animated sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{translateY: animatedY}],
            },
          ]}>
          <View style={styles.sheetHandleWrap}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>All categories</Text>
          </View>

          <FlatList
            data={level2Cats}
            keyExtractor={keyExtractor}
            renderItem={renderGridItem}
            numColumns={4} // adjust columns for layout
            contentContainerStyle={styles.gridList}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  horizontalWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  horizontalListContent: {
    paddingRight: 16,
  },
  previewItem: {
    width: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: IMAGE_SIZE_PREVIEW,
    height: IMAGE_SIZE_PREVIEW,
    borderRadius: IMAGE_SIZE_PREVIEW / 2,
    resizeMode: 'cover',
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  previewText: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 78,
    color: '#222',
  },
  seeAllCircle: {
    width: IMAGE_SIZE_PREVIEW,
    height: IMAGE_SIZE_PREVIEW,
    borderRadius: IMAGE_SIZE_PREVIEW / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: Theme.colors.primary,
  },
  seeAllInner: {
    width: IMAGE_SIZE_PREVIEW * 0.56,
    height: IMAGE_SIZE_PREVIEW * 0.38,
    borderRadius: 6,
    // the colored tile inside the circle
  },

  /* Bottom sheet */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 8,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  /* grid */
  gridList: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gridCell: {
    width: (SCREEN_WIDTH - 12 * 2 - 12) / 4, // 4 columns + spacing
    alignItems: 'center',
  },
  gridImage: {
    width: IMAGE_SIZE_GRID,
    height: IMAGE_SIZE_GRID,
    borderRadius: IMAGE_SIZE_GRID / 2,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#222',
  },
  previewTextActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },

  // small underline indicator (Zomato-like)
  activeIndicator: {
    marginTop: 6,
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
  },
});

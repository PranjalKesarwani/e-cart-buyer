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

export type TCategory = {
  _id: string; // server returns _id, we'll use it as key
  name: string;
  image: string;
};

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type Props = {
  level2Cats: TCategory[];
  // number to show in the horizontal list before 'See all' button
  previewCount?: number; // default 12
  onCategoryPress?: (cat: TCategory) => void;
};

export const HomeLevel2Cats: React.FC<Props> = ({
  level2Cats,
  previewCount = 12,
  onCategoryPress,
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

  const previewItems = useMemo(
    () => level2Cats.slice(0, previewCount),
    [level2Cats, previewCount],
  );

  const renderPreviewItem = useCallback(
    ({item}: {item: TCategory}) => (
      <TouchableOpacity
        style={styles.previewItem}
        activeOpacity={0.8}
        onPress={() => onCategoryPress?.(item)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.name} category`}>
        <Image source={{uri: item.image}} style={styles.previewImage} />
        <Text numberOfLines={1} style={styles.previewText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [onCategoryPress],
  );

  const renderSeeAll = useCallback(
    () => (
      <TouchableOpacity
        style={[styles.previewItem, styles.seeAllItem]}
        activeOpacity={0.85}
        onPress={openSheet}
        accessibilityRole="button"
        accessibilityLabel="See all categories">
        <View style={styles.seeAllCircle}>
          <Text style={styles.seeAllPlus}>+</Text>
        </View>
        <Text numberOfLines={1} style={styles.previewText}>
          See all
        </Text>
      </TouchableOpacity>
    ),
    [openSheet],
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
      {/* Horizontal preview list */}
      <View style={styles.horizontalWrap}>
        <FlatList
          data={previewItems}
          keyExtractor={keyExtractor}
          renderItem={renderPreviewItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          ItemSeparatorComponent={() => <View style={{width: 8}} />}
        />

        {/* See all button pinned to the right of the preview */}
        <View style={styles.seeAllWrap}>{renderSeeAll()}</View>
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

const IMAGE_SIZE_PREVIEW = 64;
const IMAGE_SIZE_GRID = 60;
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
    paddingRight: 8,
  },
  previewItem: {
    width: 86,
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
  seeAllWrap: {
    marginLeft: 8,
  },
  seeAllItem: {
    // visually similar to preview, but different circle
  },
  seeAllCircle: {
    width: IMAGE_SIZE_PREVIEW,
    height: IMAGE_SIZE_PREVIEW,
    borderRadius: IMAGE_SIZE_PREVIEW / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  seeAllPlus: {
    fontSize: 32,
    lineHeight: 32,
    color: '#333',
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
    width: (Dimensions.get('window').width - 12 * 2 - 12) / 4, // 4 columns + spacing
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
});

import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';

export type TChildCat = {
  _id: string;
  name: string;
  image?: string;
  path?: string;
  slug?: string;
  parentCatId?: string;
};

export type TParentCat = {
  _id: string;
  name: string;
  image?: string;
  children: TChildCat[];
};

type Props = {
  results: TParentCat[]; // your API "results"
  onChildPress?: (child: TChildCat, parent: TParentCat) => void;
  onParentPress?: (parent: TParentCat) => void;
  parentTitleStyle?: any;
  containerStyle?: any;
  // how many children to pre-render per row (tune for perf)
  initialChildrenRenderCount?: number;
};

/**
 * CategoryGroupsList
 * - Renders a vertical list of parent categories.
 * - Each parent row shows a horizontal scroll of its children (circular images + label).
 */
export const CategoryGroupsList: React.FC<Props> = ({
  results,
  onChildPress,
  onParentPress,
  parentTitleStyle,
  containerStyle,
  initialChildrenRenderCount = 6,
}) => {
  // render a single child item (circle image + name)
  const renderChild = useCallback(
    ({
      item,
      index,
      separators,
      parent,
    }: {
      item: TChildCat;
      index: number;
      separators?: any;
      parent?: TParentCat;
    }) => {
      // Note: `parent` isn't provided by FlatList; we'll pass parent via closure below
      return null;
    },
    [],
  );

  // We'll build a renderer factory to capture parent in closure (avoids re-alloc on each child render)
  const makeChildRenderer = useCallback(
    (parent: TParentCat) =>
      ({item}: ListRenderItemInfo<TChildCat>) =>
        (
          <TouchableOpacity
            key={item._id}
            activeOpacity={0.8}
            style={styles.childWrap}
            onPress={() => onChildPress?.(item, parent)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.name} under ${parent.name}`}>
            <Image
              source={
                item.image
                  ? {uri: item.image}
                  : require('../../assets/images/boltix.png')
              }
              style={styles.childImage}
              resizeMode="cover"
              // fallback handling: onError could set a local state to show placeholder (omitted to keep component stateless)
            />
            <Text numberOfLines={2} style={styles.childText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ),
    [onChildPress],
  );

  const keyExtractorParent = useCallback((p: TParentCat) => p._id, []);
  const keyExtractorChild = useCallback((c: TChildCat) => c._id, []);

  const renderParent = useCallback(
    ({item: parent}: ListRenderItemInfo<TParentCat>) => {
      const childRenderer = makeChildRenderer(parent);
      const children = parent.children || [];

      return (
        <View style={styles.parentContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onParentPress?.(parent)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${parent.name} category`}
            style={styles.parentTitleRow}>
            <Text style={[styles.parentTitle, parentTitleStyle]}>
              {parent.name}
            </Text>
            {/* Optional: parent thumbnail on the right */}
            {parent.image ? (
              <Image source={{uri: parent.image}} style={styles.parentThumb} />
            ) : null}
          </TouchableOpacity>

          <FlatList
            data={children}
            keyExtractor={keyExtractorChild}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={childRenderer}
            initialNumToRender={Math.min(
              initialChildrenRenderCount,
              children.length,
            )}
            maxToRenderPerBatch={8}
            windowSize={5}
            contentContainerStyle={styles.childrenList}
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
          />
        </View>
      );
    },
    [
      makeChildRenderer,
      onParentPress,
      initialChildrenRenderCount,
      parentTitleStyle,
    ],
  );

  const memoizedResults = useMemo(() => results || [], [results]);

  return (
    <FlatList
      data={memoizedResults}
      keyExtractor={keyExtractorParent}
      renderItem={renderParent}
      contentContainerStyle={[styles.container, containerStyle]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={4}
      maxToRenderPerBatch={6}
      windowSize={7}
      removeClippedSubviews={true}
    />
  );
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHILD_IMAGE_SIZE = 64; // small circular image size
const PARENT_THUMB_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  parentContainer: {
    marginBottom: 18,
  },

  parentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  parentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  parentThumb: {
    width: PARENT_THUMB_SIZE,
    height: PARENT_THUMB_SIZE,
    borderRadius: PARENT_THUMB_SIZE / 2,
    marginLeft: 8,
    backgroundColor: '#f0f0f0',
  },

  childrenList: {
    paddingLeft: 2,
  },

  childWrap: {
    width: CHILD_IMAGE_SIZE + 12,
    alignItems: 'center',
  },

  childImage: {
    width: CHILD_IMAGE_SIZE,
    height: CHILD_IMAGE_SIZE,
    borderRadius: CHILD_IMAGE_SIZE / 2,
    backgroundColor: '#f4f4f4',
    borderWidth: 0.5,
    borderColor: '#e2e2e2',
  },

  childText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    width: CHILD_IMAGE_SIZE + 6,
    color: '#222',
  },
});

export default CategoryGroupsList;

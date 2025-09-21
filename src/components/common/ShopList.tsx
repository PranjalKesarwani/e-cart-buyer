// components/ShopList/ShopList.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from 'react-native';
import {TShop} from '../../types';
import ShopCard from '../../screens/ShopListScreen/ShopCard';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import {TChildCat} from '../../screens/HomeScreen/CategoryGroupsList';

type QueryParams = Record<string, any>;

export type ShopListProps = {
  endpoint?: string; // default '/buyer/shops' or use category endpoint
  queryParams?: QueryParams;
  pageSize?: number;
  initialPage?: number;
  // callbacks
  onShopPress?: (shop: TShop) => void;
  onAvatarPress?: (shop: TShop) => void;
  // render hooks
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  // appearance & behavior
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
  // columns (defaults to 1, keeps cards full width when 1)
  numColumns?: number;
  // toggle automatic fetch on mount
  autoFetch?: boolean;
  catIdToShow?: TChildCat | null; // Pass category ID to fetch shops from a specific category
};

const DEFAULT_ENDPOINT = '/buyer/shops';
const DEFAULT_PAGE_SIZE = 10;

const ShopList: React.FC<ShopListProps> = ({
  endpoint = DEFAULT_ENDPOINT,
  queryParams = {},
  pageSize = DEFAULT_PAGE_SIZE,
  initialPage = 1,
  onShopPress,
  onAvatarPress,
  ListHeaderComponent = null,
  ListFooterComponent = null,
  ListEmptyComponent = null,
  contentContainerStyle = {paddingHorizontal: 16, paddingBottom: 24},
  showsVerticalScrollIndicator = false,
  numColumns = 1,
  autoFetch = true,
  catIdToShow = null,
}) => {
  const [shops, setShops] = useState<TShop[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = useCallback(
    (p: number) => {
      // make params indexable so TS is happy
      const params: Record<string, any> = {...queryParams, page: p, pageSize};

      const qs = Object.entries(params)
        .map(([k, v]) => {
          // normalize values:
          // - null/undefined -> empty string
          // - objects/arrays -> JSON.stringify (you may change behaviour if your backend expects repeated keys)
          // - otherwise -> toString()
          const value =
            v === undefined || v === null
              ? ''
              : typeof v === 'object'
              ? JSON.stringify(v)
              : String(v);

          return `${encodeURIComponent(k)}=${encodeURIComponent(value)}`;
        })
        .join('&');

      return `${endpoint}${qs ? `?${qs}` : ''}`;
    },
    [endpoint, pageSize, queryParams],
  );

  const fetchPage = useCallback(
    async (p: number, append = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const url = buildUrl(p);
        const res = await apiClient.get(url);
        const newShops: TShop[] = res.data?.shops ?? [];
        setShops(prev => (append ? [...prev, ...newShops] : newShops));

        // server hints preferred: hasMore or total
        const serverHasMore =
          typeof res.data?.hasMore === 'boolean'
            ? res.data.hasMore
            : res.data?.total != null
            ? (p - 1) * pageSize + newShops.length < res.data.total
            : newShops.length === pageSize;

        setHasMore(serverHasMore);
        setPage(p);
      } catch (err: any) {
        console.warn('ShopList fetch error', err);
        setError(err?.message ?? 'Failed to load shops');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [buildUrl, loading, pageSize],
  );

  useEffect(() => {
    if (autoFetch) fetchPage(initialPage, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(queryParams)]); // refetch when endpoint/params change

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchPage(1, false);
  }, [fetchPage]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, true);
  }, [fetchPage, hasMore, loading, page]);

  const renderItem = ({item}: ListRenderItemInfo<TShop>) => (
    <ShopCard
      item={item}
      catIdToShow={catIdToShow}
      // ShopCard should optionally accept callbacks — if not, you can pass handlers via context or modify ShopCard
      // If your ShopCard doesn't accept onAvatarPress/onPress, it will continue using its internal navigation.
      // We'll check and call onShopPress here for consistency:
      // Note: to keep ShopCard untouched, we rely on dispatch inside it. If you want parent nav, pass onShopPress prop into ShopCard.
    />
  );

  const keyExtractor = (item: TShop, idx: number) =>
    (item._id ?? (item as any).id ?? idx).toString();

  const listFooter = () => {
    if (loading && shops.length > 0) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!hasMore && shops.length > 0) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endText}>You're all caught up.</Text>
        </View>
      );
    }
    return ListFooterComponent;
  };

  const listEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      ListEmptyComponent ?? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No shops found.</Text>
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={shops}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.6}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={listFooter}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        numColumns={numColumns}
        // Important: when displaying single-column full-width cards, keep default layout.
        // If you want multi-column grid later, ensure your ShopCard adapts (use flex + maxWidth).
      />
    </View>
  );
};

export default ShopList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyText: {
    color: Theme.colors.darkGray,
    fontSize: 15,
  },
  loadingMore: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  loadingCenter: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  endMessage: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endText: {
    color: Theme.colors.darkGray,
    fontSize: 13,
  },
  errorContainer: {
    paddingVertical: 8,
  },
  errorText: {
    color: Theme.colors.error ?? 'red',
    fontSize: 13,
  },
});

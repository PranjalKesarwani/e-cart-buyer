import {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PanResponder,
} from 'react-native';
import socket from '../../utils/socket';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StatusUpdateType} from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {Theme} from '../../theme/theme';
import {useAppSelector} from '../../redux/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

type StatusViewerProps = NativeStackScreenProps<
  RootStackParamList,
  'StatusViewer'
>;

const localKeyPrefix = 'statusSeen:'; // AsyncStorage key prefix
const EMIT_THRESHOLD_MS = 800; // wait 800ms before emitting to avoid accidental flicks

const StatusViewer = ({route, navigation}: StatusViewerProps) => {
  const {_id: buyerId} = useAppSelector(state => state.buyer);

  const {
    statusUpdates,
    currentIndex: initialShopIndex,
  }: {statusUpdates: StatusUpdateType[]; currentIndex: number} = route.params;
  const [currentShopIndex, setCurrentShopIndex] =
    useState<number>(initialShopIndex);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const progress = useSharedValue(0);
  const currentShop = statusUpdates[currentShopIndex];
  const currentStatus = currentShop?.statuses[currentStatusIndex]?.content;
  const shopInfo = {
    shopPic: currentShop?.shopPic,
    shopName: currentShop?.shopName,
  };

  // session-level in-memory dedupe (won't survive app restart)
  const inMemorySentRef = useRef<Set<string>>(new Set());

  // keep track of pending timeout so we can cancel if user swipes away quickly
  const emitTimerRef = useRef<NodeJS.Timeout | null>(null);

  const validDuration = 6000;
  // const progressAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handleSwipe('right');
        } else if (gestureState.dx < -50) {
          handleSwipe('left');
        }
      },
    }),
  ).current;

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  // ---- Mark status seen logic ----
  const markStatusSeen = async (
    statusId: string,
    buyerIdArg: string,
    statusExpiresAt?: number,
  ) => {
    if (!statusId || !buyerIdArg) return;
    // session guard
    if (inMemorySentRef.current.has(statusId)) return;

    const key = localKeyPrefix + statusId;
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        // persist guard exists on this device -> mark in-memory too and return
        inMemorySentRef.current.add(statusId);
        return;
      }
    } catch (err) {
      // ignore storage errors, still proceed with in-memory guard
      console.warn('AsyncStorage read error', err);
    }

    // start threshold timer; only emit if user stays on the status for threshold duration
    if (emitTimerRef.current) {
      clearTimeout(emitTimerRef.current);
      emitTimerRef.current = null;
    }

    emitTimerRef.current = setTimeout(async () => {
      try {
        // double-check in-memory guard
        if (inMemorySentRef.current.has(statusId)) return;

        // emit socket event. Use 'saw-status' to match server handler.
        socket.emit('saw_status', {
          buyerId: buyerIdArg,
          statusId,
          statusExpiresAt,
        });

        // mark as sent in-memory
        inMemorySentRef.current.add(statusId);

        // persist locally so next visits on this device don't re-emit
        try {
          await AsyncStorage.setItem(key, '1');
          // schedule removal from AsyncStorage when the status expires (if expiresAt is available)
          if (statusExpiresAt) {
            const ttl = statusExpiresAt - Date.now();
            if (ttl > 0) {
              setTimeout(() => {
                AsyncStorage.removeItem(key).catch(e =>
                  console.warn('remove local seen key failed', e),
                );
              }, ttl);
            }
          }
        } catch (err) {
          console.warn('AsyncStorage write error', err);
        }
      } catch (err) {
        console.warn('markStatusSeen emit failed', err);
      } finally {
        // clear timer ref
        if (emitTimerRef.current) {
          clearTimeout(emitTimerRef.current);
          emitTimerRef.current = null;
        }
      }
    }, EMIT_THRESHOLD_MS);
  };

  // When status index or shop index changes -> start animation and schedule status seen emission
  useEffect(() => {
    if (currentShop?.statuses && currentShop.statuses.length > 0) {
      startProgressAnimation();

      const statusDoc = currentShop.statuses[currentStatusIndex];
      if (statusDoc?._id) {
        const expiresAtMillis = moment(statusDoc.expiresAt).valueOf();
        // schedule markStatusSeen for the currently displayed status
        markStatusSeen(statusDoc._id, buyerId as string, expiresAtMillis);
      }
    }

    // cancel any pending emit when unmounting or changing status
    return () => {
      if (emitTimerRef.current) {
        clearTimeout(emitTimerRef.current);
        emitTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatusIndex, currentShopIndex]);

  useEffect(() => {
    if (currentShop?.statuses) {
      setCurrentStatusIndex(0); // Reset status index when shop changes
      startProgressAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShopIndex]);

  const startProgressAnimation = () => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: validDuration,
        easing: Easing.linear,
      },
      finished => {
        if (finished) runOnJS(handleSwipe)('left');
      },
    );
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // clear any pending emit when user navigates away immediately
    if (emitTimerRef.current) {
      clearTimeout(emitTimerRef.current);
      emitTimerRef.current = null;
    }

    if (direction === 'left') {
      // Check if there's next status in current shop
      if (currentStatusIndex < (currentShop?.statuses?.length ?? 0) - 1) {
        setCurrentStatusIndex(prev => prev + 1);
      } else {
        // Move to next shop if available
        if (currentShopIndex < statusUpdates.length - 1) {
          setCurrentShopIndex(prev => prev + 1);
          setCurrentStatusIndex(0);
        } else {
          navigation.goBack();
        }
      }
    } else {
      // Swipe right
      if (currentStatusIndex > 0) {
        setCurrentStatusIndex(prev => prev - 1);
      } else {
        // Move to previous shop if available
        if (currentShopIndex > 0) {
          const newShopIndex = currentShopIndex - 1; // Calculate first
          const prevShopStatuses = statusUpdates[newShopIndex].statuses;
          setCurrentShopIndex(newShopIndex);
          setCurrentStatusIndex(prevShopStatuses.length - 1);
        } else {
          navigation.goBack();
        }
      }
    }
  };

  useEffect(() => {
    // cleanup on unmount (clear timer)
    return () => {
      if (emitTimerRef.current) {
        clearTimeout(emitTimerRef.current);
        emitTimerRef.current = null;
      }
    };
  }, []);

  if (!currentShop || !currentStatus) return null;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Progress Bars */}
      <View style={[styles.progressBarContainer, {zIndex: 2}]}>
        {currentShop?.statuses.map((_: any, index: number) => (
          <View key={index} style={[styles.progressBarBackground]}>
            {index === currentStatusIndex && (
              <Animated.View
                style={[
                  styles.progressBarForeground,
                  progressStyle, // Correct usage without .value
                ]}
              />
            )}
            {index < currentStatusIndex && (
              <View style={styles.progressBarForeground} />
            )}
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{uri: shopInfo.shopPic}} style={styles.shopAvatar} />
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{shopInfo.shopName}</Text>
          <Text style={styles.timeLeft}>
            {moment(
              currentShop.statuses[currentStatusIndex]?.createdAt,
            ).fromNow()}
          </Text>
        </View>
      </View>

      {/* Content */}
      {currentStatus.background.type === 'color' ? (
        <View
          style={[
            styles.background,
            {backgroundColor: currentStatus.background.value},
          ]}
        />
      ) : (
        <Image
          source={{uri: currentStatus.background.value}}
          style={styles.background}
          resizeMode="cover"
        />
      )}

      {/* Text Content */}
      <View
        style={[
          styles.textContainer,
          {
            left: currentStatus.text.position.x * width,
            top: currentStatus.text.position.y * height,
          },
        ]}>
        <Text
          style={[
            styles.statusText,
            {
              color: currentStatus.text.color,
              fontWeight:
                currentStatus.text.fontStyle === 'bold' ? 'bold' : 'normal',
              textAlign: currentStatus.text.alignment,
            },
          ]}>
          {currentStatus.text.content}
        </Text>
      </View>

      {/* Navigation Controls */}
      <TouchableOpacity
        style={styles.leftTouchArea}
        onPress={() => handleSwipe('right')}
      />
      <TouchableOpacity
        style={styles.rightTouchArea}
        onPress={() => handleSwipe('left')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingTop: 8,
    gap: 5,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  shopAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  timeLeft: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    alignSelf: 'flex-start', // container should size to content
    paddingHorizontal: 4, // optional for spacing
    flexShrink: 1, // allow it to shrink if needed
    backgroundColor: 'transparent',
  },
  statusText: {
    fontSize: 24,
    includeFontPadding: false,
    flexWrap: 'wrap',
  },
  leftTouchArea: {
    ...StyleSheet.absoluteFillObject,
    right: '50%',
  },
  rightTouchArea: {
    ...StyleSheet.absoluteFillObject,
    left: '50%',
  },
});

export default StatusViewer;

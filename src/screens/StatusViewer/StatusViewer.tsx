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

const {width, height} = Dimensions.get('window');

type StatusViewerProps = NativeStackScreenProps<
  RootStackParamList,
  'StatusViewer'
>;

const StatusViewer = ({route, navigation}: StatusViewerProps) => {
  const {statusUpdates, currentIndex} = route.params;
  const [currentStatusIndex, setCurrentStatusIndex] = useState(currentIndex);
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

  const currentStatus = statusUpdates[currentStatusIndex]?.content;
  const shopInfo = statusUpdates[currentStatusIndex]?.shopId;
  const progress = useSharedValue(0);
  const duration = moment(statusUpdates[currentStatusIndex]?.expiresAt).diff(
    moment(statusUpdates[currentStatusIndex]?.createdAt),
    'milliseconds',
  );

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  useEffect(() => {
    startProgressAnimation();
  }, [currentStatusIndex]);

  const startProgressAnimation = () => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: duration,
        easing: Easing.linear,
      },
      finished => {
        if (finished) runOnJS(handleSwipe)('left');
      },
    );
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (currentStatusIndex < statusUpdates.length - 1) {
        setCurrentStatusIndex((prev: number) => prev + 1);
      } else {
        navigation.goBack();
      }
    } else {
      if (currentStatusIndex > 0) {
        setCurrentStatusIndex((prev: number) => prev - 1);
      } else {
        navigation.goBack();
      }
    }
  };

  if (!currentStatus) return null;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Progress Bars */}
      <View style={styles.progressBarContainer}>
        {statusUpdates.map((_: any, index: number) => (
          <View key={index} style={styles.progressBarBackground}>
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
            {moment(statusUpdates[currentStatusIndex].createdAt).fromNow()}
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
        onPress={() => handleSwipe('left')}
      />
      <TouchableOpacity
        style={styles.rightTouchArea}
        onPress={() => handleSwipe('right')}
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
    backgroundColor: 'white',
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
    maxWidth: '90%',
  },
  statusText: {
    fontSize: 24,
    includeFontPadding: false,
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

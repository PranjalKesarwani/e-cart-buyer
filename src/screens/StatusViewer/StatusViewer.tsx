import {useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StatusUpdateType} from '../../types';

const {width, height} = Dimensions.get('window');

type StatusViewerProps = NativeStackScreenProps<
  RootStackParamList,
  'StatusViewer'
>;

const StatusViewer = ({route, navigation}: StatusViewerProps) => {
  const {statusUpdates, currentIndex} = route.params;
  const [currentStatusIndex, setCurrentStatusIndex] =
    useState<number>(currentIndex);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentStatusIndex < statusUpdates.length - 1) {
      setCurrentStatusIndex(prev => prev + 1);
    } else if (direction === 'right' && currentStatusIndex > 0) {
      setCurrentStatusIndex(prev => prev - 1);
    }
  };

  const currentStatus = statusUpdates[currentStatusIndex]?.content;

  if (!currentStatus) return null;

  return (
    <View style={styles.viewerContainer}>
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
        />
      )}

      <View
        style={[
          styles.textContent,
          {
            left: currentStatus.text.position.x * width,
            top: currentStatus.text.position.y * height,
            alignItems: currentStatus.text.alignment,
          },
        ]}>
        <Text
          style={[
            styles.statusText,
            {
              fontWeight: currentStatus.text.fontStyle as
                | 'normal'
                | 'bold'
                | '100'
                | '200'
                | '300'
                | '400'
                | '500'
                | '600'
                | '700'
                | '800'
                | '900',
              color: currentStatus.text.color,
              textAlign: currentStatus.text.alignment,
            },
          ]}>
          {currentStatus.text.content}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.leftSwipeArea}
        onPress={() => handleSwipe('left')}
      />
      <TouchableOpacity
        style={styles.rightSwipeArea}
        onPress={() => handleSwipe('right')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textContent: {
    position: 'absolute',
    transform: [{translateX: -50}, {translateY: -50}],
  },
  statusText: {
    fontSize: 24,
    includeFontPadding: false,
  },
  leftSwipeArea: {
    position: 'absolute',
    top: 0,
    right: '50%',
    bottom: 0,
    left: 0,
    opacity: 0,
  },
  rightSwipeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '50%',
    opacity: 0,
  },
});

export default StatusViewer;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Svg, Circle} from 'react-native-svg';

import {apiClient} from '../../services/api';
import {
  MainTabsParamList,
  RootStackParamList,
  StatusUpdateType,
} from '../../types';
import {sampleStatuses} from '../../utils/util';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StatusViewer'
>;

const StatusScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [unseenStatusUpdates, setUnseenStatusUpdates] = useState<
    StatusUpdateType[]
  >([]);
  const [seenStatusUpdates, setSeenStatusUpdates] = useState<
    StatusUpdateType[]
  >([]);

  const getStatusUpdates = async () => {
    try {
      const res = await apiClient.get('/buyer/get-nearby-status-updates');
      if (res.data.success) {
        setUnseenStatusUpdates(res.data.unseenShopUpdates);
        setSeenStatusUpdates(res.data.seenShopUpdates);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatusUpdates();
  }, []);

  const handleStatusPress = (statusIndex: number) => {
    navigation.navigate('StatusViewer', {
      unseenStatusUpdates,
      currentIndex: statusIndex,
    });
  };

  const renderStatusItem = (shop: StatusUpdateType, index: number) => {
    if (!shop.statuses || shop.statuses.length === 0) return null;

    const totalStatuses = shop.statuses.length;
    const avatar = shop.shopPic; // Using shop's profile picture instead of status background
    const name = shop.shopName;
    const latestStatus = shop.statuses[0];
    const time = new Date(latestStatus.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate angles for each segment
    const segmentAngle = 360 / totalStatuses;
    const radius = 28; // Match avatar radius
    const circumference = 2 * Math.PI * radius;

    return (
      <TouchableOpacity
        key={shop._id}
        style={styles.statusItem}
        onPress={() => handleStatusPress(index)}>
        <View style={styles.avatarContainer}>
          <Svg height="60" width="60" style={styles.statusRing}>
            {/* Background circle */}
            <Circle
              cx="30"
              cy="30"
              r={radius}
              stroke="#e8e8e8"
              strokeWidth="2"
              fill="none"
            />

            {/* Status segments */}
            {shop.statuses.map((_, idx) => (
              <Circle
                key={idx}
                cx="30"
                cy="30"
                r={radius}
                stroke="#25D366"
                strokeWidth="2"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (circumference * segmentAngle) / 360
                }
                rotation={-90 + idx * segmentAngle}
                originX="30"
                originY="30"
              />
            ))}
          </Svg>
          <Image source={{uri: avatar}} style={styles.avatar} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingTop: 20,
          paddingLeft: 15,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: '#e8e8e8',
        }}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Updates</Text>
      </View>
      <ScrollView>
        {unseenStatusUpdates?.length > 0 ? (
          <>
            <Text style={styles.sectionHeader}>Recent updates</Text>
            {unseenStatusUpdates.map((item, index) =>
              renderStatusItem(item, index),
            )}
          </>
        ) : (
          <Text style={{textAlign: 'center', marginTop: 50}}>
            No status updates yet
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  // avatarContainer: {
  //   position: 'relative',
  // },
  // avatar: {
  //   width: 56,
  //   height: 56,
  //   borderRadius: 28,
  //   marginRight: 15,
  // },
  unviewedBorder: {
    borderWidth: 2,
    borderColor: '#25D366',
  },
  addStatus: {
    position: 'absolute',
    bottom: -2,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  sectionHeader: {
    padding: 15,
    paddingBottom: 10,
    color: '#666',
    backgroundColor: '#f8f8f8',
    fontWeight: '600',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#25D366',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    marginRight: 15,
  },
  statusRing: {
    position: 'absolute',
    transform: [{rotate: '-90deg'}],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    top: 2,
    left: 2,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default StatusScreen;

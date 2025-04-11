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
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import {apiClient} from '../../services/api';
import {
  MainTabsParamList,
  RootStackParamList,
  StatusUpdateType,
} from '../../types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StatusViewer'
>;

const StatusScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdateType[] | []>(
    [],
  );

  const getStatusUpdates = async () => {
    try {
      const res = await apiClient.get('/buyer/get-nearby-status-updates');
      // console.log('Status updatesxxx:', res.data);
      setStatusUpdates(res.data.statusUpdates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatusUpdates();
  }, []);

  const handleStatusPress = (statusIndex: number) => {
    navigation.navigate('StatusViewer', {
      statusUpdates,
      currentIndex: statusIndex,
    });
  };

  const renderStatusItem = (item: StatusUpdateType, index: number) => {
    if (!item || !item.content || !item.content.background) return null;

    const isImage = item.content.background.type === 'image';
    console.log('Status item:', item);
    console.log('Status item content:', item.content);
    console.log('Status item background:', item.content.background);
    console.log('Status item background type:', item.content.background.type);
    console.log('Status item background value:', item.content.background.value);
    console.log('Status item createdAt:', item.createdAt);
    console.log('Status item index:', index);

    const avatar = isImage
      ? item.content.background.value
      : 'https://via.placeholder.com/150';

    const name = item.shopId.shopName;
    const time = new Date(item.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        key={item._id}
        style={styles.statusItem}
        onPress={() => handleStatusPress(index)}>
        <View style={styles.avatarContainer}>
          <Image
            source={{uri: avatar}}
            style={[styles.avatar, styles.unviewedBorder]}
          />
          {/* {index === 0 && (
            <View style={styles.addStatus}>
              <Icon name="add-circle" size={24} color="#25D366" />
            </View>
          )} */}
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
      <ScrollView>
        {statusUpdates?.length > 0 ? (
          <>
            <Text style={styles.sectionHeader}>Recent updates</Text>
            {statusUpdates.map((item, index) => renderStatusItem(item, index))}
          </>
        ) : (
          <Text style={{textAlign: 'center', marginTop: 50}}>
            No status updates yet
          </Text>
        )}
      </ScrollView>

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.cameraButton}>
        <Icon name="photo-camera" size={28} color="white" />
      </TouchableOpacity>
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
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 15,
  },
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
});

export default StatusScreen;

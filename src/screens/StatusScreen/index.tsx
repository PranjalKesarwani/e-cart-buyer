import React, {useEffect} from 'react';
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
import {apiClient} from '../../services/api';

const StatusScreen = () => {
  // Mock data for status updates
  const statusUpdates = [
    {
      id: 1,
      name: 'My Status',
      time: 'Tap to add status update',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isViewed: false,
    },
    {
      id: 2,
      name: 'John',
      time: '20 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isViewed: false,
    },
    {
      id: 3,
      name: 'Alice',
      time: '45 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isViewed: true,
    },
    // Add more status items...
  ];

  const getStatusUpdates = async () => {
    try {
      const res = await apiClient.get('/buyer/get-nearby-status-updates');
      console.log('Status updates:', res.data.statusUpdates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatusUpdates();
  }, []);

  const renderStatusItem = (item: any, index: any) => {
    return (
      <TouchableOpacity key={item.id} style={styles.statusItem}>
        <View style={styles.avatarContainer}>
          <Image
            source={{uri: item.avatar}}
            style={[styles.avatar, !item.isViewed && styles.unviewedBorder]}
          />
          {index === 0 && (
            <View style={styles.addStatus}>
              <Icon name="add-circle" size={24} color="#25D366" />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* My Status */}
        {renderStatusItem(statusUpdates[0], 0)}

        {/* Recent Updates */}
        <Text style={styles.sectionHeader}>Recent updates</Text>
        {statusUpdates
          .slice(1)
          .map((item, index) => renderStatusItem(item, index + 1))}

        {/* Viewed Updates */}
        <Text style={styles.sectionHeader}>Viewed updates</Text>
        {statusUpdates
          .slice(2)
          .map((item, index) => renderStatusItem(item, index + 2))}
      </ScrollView>

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.cameraButton}>
        <Icon name="photo-camera" size={28} color="white" />
      </TouchableOpacity>

      {/* Header Icons */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="photo-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#008069',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 25,
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

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RootDrawerParamList} from '../../types'; // Assuming you only need RootDrawerParamList
import Icons from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Title from '../../components/Title';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {request} from '../../services/api';

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'HomeScreen'>;

type TCategoryCards = {
  id: number;
  text: string;
};

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const modalHeight = windowHeight;
  const [mLat, setMLat] = useState<number>(0);
  const [mLong, setMLong] = useState<number>(0);
  const [globalCats, setGlobalCats] = useState<any>([]);

  const getGlocalCategories = async () => {
    try {
      const res = await request('GET', '/buyer/categories');
      console.log('res-----', res);
      if (!res?.data.success) throw new Error(res?.data.message);
      if (res.success) {
        setGlobalCats(res.data.categories);
      }
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    getGlocalCategories();
  }, []);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'We need your location for your better experience!' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    console.log('trying to get current location');
    try {
      Geolocation.getCurrentPosition(
        position => {
          setMLat(position.coords.latitude);
          setMLong(position.coords.longitude);
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log('fallen into error');
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.log('--xx--', error);
    }
  };

  const handleCardPress = (item: any) => {
    console.log('item', item);
    navigation.navigate('ShopListScreen', {category: item});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.touchable}>
          <View style={{flexDirection: 'row', width: '58%'}}>
            <Icons name="down" size={17} color={'black'} />
            <View>
              <Text style={styles.headerText}>Sahson</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.subHeaderText}>
                Opposite Ramleela maidan, 221507
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text style={{fontSize: 20, width: '80%', textAlign: 'center'}}>
          Hey! What are you looking for?{' '}
        </Text>
      </View>

      <FlatList
        data={globalCats}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => handleCardPress(item)}>
            <View style={styles.card}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.modalView, {height: modalHeight}]}>
          <Button
            title="Close"
            onPress={() => setModalVisible(!modalVisible)}
          />
          <MapView
            style={{width: '80%', height: '50%'}}
            initialRegion={{
              latitude: 28.68344961110582,
              longitude: 77.21538250329944,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker coordinate={{latitude: mLat, longitude: mLong}} />
          </MapView>
          <TouchableOpacity
            onPress={() => getCurrentLocation()}
            style={{
              width: '70%',
              height: 40,
              alignSelf: 'center',
              position: 'absolute',
              bottom: 20,
              backgroundColor: 'orange',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff'}}>Get current location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 3,
  },
  subHeaderText: {
    fontSize: 12,
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 'auto',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0, // Adjust as needed
    paddingVertical: 5, // Adjust as needed
    borderRadius: 5, // Example border radius
    borderColor: 'red',
    borderWidth: 2,
    width: '60%',
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B4B4B8',
    height: 100,
  },
  categoryContainer: {
    width: '40%',

    flex: 1,
  },
});

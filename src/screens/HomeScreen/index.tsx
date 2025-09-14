// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Modal,
//   TouchableOpacity,
//   Dimensions,
//   Image,
//   Linking,
//   TextInput,
//   Platform,
//   ImageBackground,
// } from 'react-native';
// import LocationBottomSheet from '../../components/LocationBottomSheet';
// import {RootDrawerParamList, TCategory, THomeCats} from '../../types';
// import Icons from 'react-native-vector-icons/AntDesign';
// import MapView, {Marker} from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import {FlatList} from 'react-native-gesture-handler';
// import {showToast} from '../../utils/toast';
// import {apiClient} from '../../services/api';
// import {Theme} from '../../theme/theme';
// import axios from 'axios';
// import {useAppSelector} from '../../redux/hooks';
// import {cleanAddress, isLocationEnabled} from '../../utils/helper';
// import {
//   getHomeCats,
//   giveLocationPermission,
//   handleLogout,
// } from '../../services/apiService';
// import {getAddressFromCoordinates} from '../../services/locationService';
// import {getInitials} from '../../utils/util';
// import {HomeLevel2Cats} from './HomeLevel2Cats';
// import {BannerCarousel} from './BannerCarousel';
// import CategoryGroupsList, {TParentCat, TChildCat} from './CategoryGroupsList';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.37);

// type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'Home'>;

// const HomeScreen = ({navigation}: HomeProps) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [bannerUrls, setBannerUrls] = useState<string[]>([
//     'https://i.pinimg.com/736x/37/84/08/37840842216139312fe81b7f6a87879a.jpg',
//     'https://i.pinimg.com/736x/51/d3/88/51d38806d50482762c700eca5717a32f.jpg',
//     'https://i.pinimg.com/736x/fe/94/49/fe9449d9194c643e988e8ec1e4457019.jpg',
//     'https://i.pinimg.com/736x/49/e7/2c/49e72c660a2e109ffb1771c33a9443c1.jpg',
//     'https://i.pinimg.com/736x/b9/73/2f/b9732fba22bbae9098fe50e6574f9b1f.jpg',
//     'https://i.pinimg.com/1200x/93/84/83/93848363ee8d0fc903d296885349e6ac.jpg',
//   ]);
//   const [showLocationSheet, setShowLocationSheet] = useState(false);
//   const {lastSavedformattedAddress, hasSetLocation, name} = useAppSelector(
//     state => state.buyer,
//   );
//   const [addressToShow, setAddressToShow] = useState<string>(
//     lastSavedformattedAddress,
//   );
//   const savedAddresses: any[] = [];
//   const mapRef = useRef<MapView>(null);

//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   const [globalCats, setGlobalCats] = useState<any>([]);
//   const [homeCats, setHomeCats] = useState<THomeCats[]>([]);
//   const [homeSecondLevelCats, setHomeSecondLevelCats] = useState<TCategory[]>(
//     [],
//   );

//   const getGlobalCategories = async () => {
//     try {
//       const res = await apiClient.get('/buyer/categories');
//       if (!res?.data.success) throw new Error(res?.data.message);
//       setGlobalCats(res.data.categories);

//       const {status, message, data} = await getHomeCats();

//       setHomeCats(data.results);
//       setHomeSecondLevelCats(data.level2Cats);
//     } catch (error: any) {
//       showToast('error', error.message);
//     }
//   };

//   const requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'We need your location for a better experience!',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) return;

//       const location = await new Promise<Geolocation.GeoPosition>(
//         (resolve, reject) => {
//           Geolocation.getCurrentPosition(resolve, reject, {
//             enableHighAccuracy: true,
//             timeout: 15000,
//             maximumAge: 0,
//           });
//         },
//       );

//       const newCoords = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
//       console.log('Current location:', newCoords);
//       setUserLocation(newCoords);

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(
//           {
//             ...newCoords,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           },
//           1000,
//         );
//       }
//     } catch (error: any) {
//       console.log('Location error:', error.code, error.message);
//       showToast('error', `Location error: ${error.message}`);
//       if (error.code === 2) {
//         Alert.alert(
//           'Location Required',
//           'Please enable device location services',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Settings', onPress: () => Linking.openSettings()},
//           ],
//         );
//       }
//     }
//   };

//   const initializeLocation = async () => {
//     const {status, message, data} = await giveLocationPermission();
//     if (status) {
//       const displayAddress = data.address ?? data.formattedAddress;
//       setAddressToShow(cleanAddress(displayAddress));
//     }
//   };

//   const checkIsLocationEnabled = async () => {
//     const locationEnableInfo = await isLocationEnabled();
//     if (!locationEnableInfo) {
//       setShowLocationSheet(true);
//       return;
//     }
//     initializeLocation();
//   };

//   useEffect(() => {
//     checkIsLocationEnabled();
//     getGlobalCategories();
//   }, []);

//   const handleCardPress = (item: any) => {
//     navigation.navigate('ShopListScreen', {category: item});
//   };

//   const handleAddressSelect = (address: string) => {
//     // setConfirmedAddress(address);
//     // You might want to update the location coordinates here as well
//   };

//   const handleHomeScreenLocation = () => {
//     try {
//       // setModalVisible(true);

//       navigation.navigate('LocationConfirmationScreen');
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleLevel2CategoryPress = async (cat: TCategory) => {
//     console.log('Pressed this category:::', cat);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}

//       <ImageBackground
//         source={require('../../assets/images/header.png')} // or local: require('../assets/header-hero.jpg')
//         style={styles.headerContainer}
//         imageStyle={styles.headerImage}
//         resizeMode="cover">
//         {/* semi-transparent overlay to guarantee legibility */}
//         <View style={styles.headerOverlay} />

//         <View style={styles.headerContent}>
//           {/* Top row: location + profile */}
//           <View style={styles.headerTop}>
//             <TouchableOpacity
//               style={styles.locationCard}
//               activeOpacity={0.86}
//               onPress={handleHomeScreenLocation}
//               accessibilityRole="button"
//               accessibilityLabel="Open location selector">
//               <Icons
//                 name="enviromento"
//                 size={20}
//                 color="#fff"
//                 style={{fontWeight: 'bold'}}
//               />

//               <View style={styles.locationTextWrap}>
//                 <View style={styles.nameRow}>
//                   <Text style={styles.locationName}>
//                     {name || 'Set location'}
//                   </Text>
//                   <Icons name="down" size={16} color="rgba(255,255,255,0.9)" />
//                 </View>
//                 <Text
//                   numberOfLines={1}
//                   ellipsizeMode="tail"
//                   style={styles.locationAddressText}>
//                   {addressToShow || 'Tap to set delivery location'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.profileIconButton}
//               onPress={() => {
//                 /* open profile */
//               }}
//               activeOpacity={0.9}
//               accessibilityRole="button"
//               accessibilityLabel="Profile">
//               {name && name.length > 0 ? (
//                 <Text style={styles.initialsText}>
//                   {getInitials(name as string)}
//                 </Text>
//               ) : (
//                 <Icons name="user" size={18} color={Theme.colors.primary} />
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Search Row */}
//           <View style={styles.headerSearchRow}>
//             <View style={styles.headerSearchBox}>
//               <Icons
//                 name="search1"
//                 size={16}
//                 color="rgba(255,255,255,0.95)"
//                 style={{fontWeight: 'bold'}}
//               />
//               <TextInput
//                 placeholder="Search shops, products or categories"
//                 placeholderTextColor="rgba(255,255,255,0.85)"
//                 style={styles.headerSearchInput}
//                 returnKeyType="search"
//                 onSubmitEditing={() => {}}
//               />
//             </View>
//           </View>

//           {/* Tagline centered in remaining space */}
//           <View style={styles.headerTaglineWrap}>
//             <Text style={styles.headerTagline}>All your local shops</Text>
//             <Text style={styles.headerTagline}>just a tap away.</Text>
//           </View>
//         </View>
//       </ImageBackground>

//       <HomeLevel2Cats
//         level2Cats={homeSecondLevelCats}
//         previewCount={12}
//         onCategoryPress={handleLevel2CategoryPress}
//       />

//       <BannerCarousel
//         banners={bannerUrls} // string[] of image URLs
//         height={150} // optional, defaults to 140
//         autoplayInterval={4000} // ms, optional default 4000
//         onBannerPress={(url: string, index: number) => {
//           console.log('Pressed banner:', url);
//         }}
//       />

//       <CategoryGroupsList
//         results={homeCats}
//         onParentPress={p => console.log('Parent tapped', p._id)}
//         onChildPress={(child, parent) =>
//           console.log('Child tapped', child._id, 'under', parent._id)
//         }
//       />

//       {/* Main Content */}
//       <View style={styles.contentContainer}>
//         <Text style={styles.welcomeMessage}>
//           Discover something amazing today!
//         </Text>

//         {/* Categories Grid */}
//         <FlatList
//           data={globalCats}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               style={[styles.categoryCard]}
//               activeOpacity={0.9}
//               onPress={() => handleCardPress(item)}>
//               <View style={[styles.categoryContent]}>
//                 <View style={[styles.imageContainer]}>
//                   <Image
//                     style={[styles.categoryImage, {borderTopRightRadius: 5.6}]}
//                     source={{uri: item.image}}
//                     resizeMode="cover"
//                   />
//                 </View>
//                 <Text style={styles.categoryName}>{item.name}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           keyExtractor={item => item.id.toString()}
//           numColumns={2}
//           contentContainerStyle={styles.gridContainer}
//         />
//       </View>

//       {/* Location Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Location</Text>
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               style={styles.closeButton}>
//               <Icons name="close" size={24} color={Theme.colors.baseYellow} />
//             </TouchableOpacity>
//           </View>

//           <MapView
//             style={styles.map}
//             ref={mapRef}
//             provider="google"
//             region={
//               userLocation
//                 ? {
//                     latitude: userLocation.latitude,
//                     longitude: userLocation.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                   }
//                 : undefined
//             }
//             onRegionChangeComplete={region => {
//               setUserLocation({
//                 latitude: region.latitude,
//                 longitude: region.longitude,
//               });
//             }}
//             showsUserLocation={true}
//             followsUserLocation={false}>
//             {userLocation && (
//               <Marker coordinate={userLocation}>
//                 <View style={styles.customMarker}>
//                   <Icons name="enviromento" size={30} color="#003366" />
//                   <View style={styles.markerPulse} />
//                 </View>
//               </Marker>
//             )}
//           </MapView>

//           <View style={styles.centerMarker}>
//             <Icons name="enviromento" size={30} color="#003366" />
//             <View style={styles.markerPulse} />
//           </View>
//           <TouchableOpacity
//             style={styles.confirmButton}
//             onPress={async () => {
//               if (userLocation) {
//                 // setConfirmedLocation(userLocation);
//                 const address = await getAddressFromCoordinates(
//                   userLocation.latitude,
//                   userLocation.longitude,
//                 );
//                 setModalVisible(false);
//               }
//             }}>
//             <Text style={styles.confirmButtonText}>Confirm Location</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={getCurrentLocation}
//             style={styles.currentLocationButton}>
//             <Icons name="enviromento" size={30} color="#FFF" />
//             <Text style={styles.locationButtonText}>Use Current Location</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       <LocationBottomSheet
//         isVisible={showLocationSheet}
//         onClose={() => setShowLocationSheet(false)}
//         savedAddresses={savedAddresses}
//         onEnableLocation={getCurrentLocation}
//         onAddressSelect={handleAddressSelect}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

// const colors = {
//   primary: '#6C5CE7', // Sophisticated purple
//   secondary: '#FF9F43', // Warm orange
//   background: '#F8F9FA', // Light background
//   text: '#2D3436', // Dark text
//   darkGray: '#636E72', // Secondary text
//   lightGray: '#DFE6E9', // Borders
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: colors.lightGray,
//   },
//   locationSelector: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   locationContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//     color: Theme.colors.primary,
//   },
//   locationTitle: {
//     fontSize: 14,
//     color: colors.darkGray,
//     fontWeight: '500',
//   },
//   locationAddress: {
//     fontSize: 16,
//     color: colors.text,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   contentContainer: {
//     flex: 1,
//     paddingHorizontal: 7,
//   },
//   welcomeMessage: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.text,
//     marginVertical: 24,
//     textAlign: 'center',
//     lineHeight: 32,
//   },
//   // gridContainer: {
//   //   paddingBottom: 24,
//   // },
//   categoryIcon: {
//     backgroundColor: '#F0F2FE',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.lightGray,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   closeButton: {
//     padding: 8,
//   },

//   locationButtonText: {
//     marginLeft: 10,
//     color: '#003366',
//     fontWeight: 'bold',
//   },
//   categoryCard: {
//     flex: 1,
//     margin: 8,
//     borderWidth: 1, // Subtle border
//     borderColor: '#E0E0E0', // Light gray for professionalism
//     borderRadius: 8, // Rounded corners
//     backgroundColor: '#FFFFFF', // Clean white background
//     elevation: 2, // Subtle shadow for depth
//     paddingBottom: 3, // Internal spacing
//   },
//   categoryContent: {
//     alignItems: 'center',
//     width: '100%',
//     paddingBottom: 8, // Space at the bottom
//   },
//   imageContainer: {
//     width: '100%',
//     height: 100, // Increased height for better image visibility
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopEndRadius: 8, // Rounded top corners
//   },
//   categoryImage: {
//     width: '100%', // Slightly less than full width for padding
//     height: '100%', // Maintains aspect ratio
//     resizeMode: 'cover', // Ensures image fits without distortion
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: '600', // Slightly bold for a polished look
//     color: '#333', // Dark gray for readability
//     marginTop: 8, // Space between image and text
//     textAlign: 'center', // Center text for consistency
//   },
//   gridContainer: {
//     padding: 10, // Padding around the grid
//   },
//   customMarker: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // markerPulse: {
//   //   position: 'absolute',
//   //   backgroundColor: '#00336622',
//   //   width: 40,
//   //   height: 40,
//   //   borderRadius: 20,
//   //   zIndex: -1,
//   // },
//   // Ensure your map has proper dimensions
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height * 0.8, // Use 80% of screen height
//   },
//   centerMarker: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -15,
//     marginTop: -40,
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   markerPulse: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0, 51, 102, 0.2)',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     top: -5,
//     zIndex: -1,
//   },
//   confirmButton: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     backgroundColor: Theme.colors.bharatPurple,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   confirmButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   currentLocationButton: {
//     position: 'absolute',
//     bottom: 40,
//     right: 20,
//     backgroundColor: Theme.colors.bharatPurple,
//     padding: 12,
//     borderRadius: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },

//   logoutPill: {
//     marginLeft: 12,
//     backgroundColor: Theme.colors.baseYellow,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     minWidth: 72,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   logoutPillText: {
//     color: '#111',
//     fontWeight: '600',
//   },

//   headerMapButton: {
//     marginLeft: 10,
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     backgroundColor: Theme.colors.bharatPurple,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//   },

//   headerContainer: {
//     width: '100%',
//     height: HEADER_HEIGHT,
//   },
//   headerImage: {
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//     // optionally slightly desaturate or blur the image in edit tools, not necessary here
//   },

//   // overlay to darken image slightly -> improves legibility
//   headerOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.04)', // tweak 0.2–0.36 to taste
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//   },

//   // wrapper to layer content on top of the overlay
//   headerContent: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 22 : 16,
//     paddingBottom: 18,
//     justifyContent: 'flex-start',
//   },

//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   /* Location card: semi-transparent so it feels like a panel on top of the hero */
//   locationCard: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     // backgroundColor: 'rgba(255,255,255,0.10)', // soft translucent white
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'transparent',
//     // subtle inner shadow impression on iOS (android will ignore)
//     // shadowColor: '#000',
//     // shadowOffset: {width: 0, height: 1},
//     // shadowOpacity: 0.05,
//     // shadowRadius: 6,
//     marginRight: 12,
//   },

//   locationTextWrap: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: 'center',
//   },

//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   locationName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fff',
//     marginRight: 6,
//   },

//   locationAddressText: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 2,
//   },

//   /* Profile icon: white circular button so it stands out against amber background */
//   profileIconButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#fff', // white contrast
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.06)',
//     // subtle shadow
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   initialsText: {
//     color: Theme.colors.primary,
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   /* Search box: translucent, inverted text color to white */
//   headerSearchRow: {
//     marginTop: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   headerSearchBox: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)', // translucent
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: 'rgb(255, 216, 139)',
//   },

//   headerSearchInput: {
//     marginLeft: 10,
//     flex: 1,
//     fontSize: 17,
//     color: '#fff', // input text white
//     padding: 0,
//     fontWeight: '500',
//   },

//   /* Tagline centered and big, white */
//   headerTaglineWrap: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     paddingHorizontal: 8,
//   },

//   headerTagline: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#fff',
//     textAlign: 'center',
//     lineHeight: 36,
//     fontStyle: 'italic',
//   },
// });

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  TextInput,
  Platform,
  ImageBackground,
  Animated,
} from 'react-native';
import LocationBottomSheet from '../../components/LocationBottomSheet';
import {RootDrawerParamList, TCategory, THomeCats} from '../../types';
import Icons from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {FlatList} from 'react-native-gesture-handler';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {Theme} from '../../theme/theme';
import axios from 'axios';
import {useAppSelector} from '../../redux/hooks';
import {cleanAddress, isLocationEnabled} from '../../utils/helper';
import {
  getHomeCats,
  giveLocationPermission,
  handleLogout,
} from '../../services/apiService';
import {getAddressFromCoordinates} from '../../services/locationService';
import {getInitials} from '../../utils/util';
import {HomeLevel2Cats} from './HomeLevel2Cats';
import {BannerCarousel} from './BannerCarousel';
import CategoryGroupsList, {TParentCat, TChildCat} from './CategoryGroupsList';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.37);
const COMPACT_HEADER_HEIGHT = 64;

type HomeProps = NativeStackScreenProps<RootDrawerParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [bannerUrls, setBannerUrls] = useState<string[]>([
    'https://i.pinimg.com/736x/37/84/08/37840842216139312fe81b7f6a87879a.jpg',
    'https://i.pinimg.com/736x/51/d3/88/51d38806d50482762c700eca5717a32f.jpg',
    'https://i.pinimg.com/736x/fe/94/49/fe9449d9194c643e988e8ec1e4457019.jpg',
    'https://i.pinimg.com/736x/49/e7/2c/49e72c660a2e109ffb1771c33a9443c1.jpg',
    'https://i.pinimg.com/736x/b9/73/2f/b9732fba22bbae9098fe50e6574f9b1f.jpg',
    'https://i.pinimg.com/1200x/93/84/83/93848363ee8d0fc903d296885349e6ac.jpg',
  ]);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const {lastSavedformattedAddress, hasSetLocation, name} = useAppSelector(
    state => state.buyer,
  );
  const scrollY = useRef(new Animated.Value(0)).current;
  const [addressToShow, setAddressToShow] = useState<string>(
    lastSavedformattedAddress,
  );
  const savedAddresses: any[] = [];
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [globalCats, setGlobalCats] = useState<any>([]);
  const [homeCats, setHomeCats] = useState<THomeCats[]>([]);
  const [homeSecondLevelCats, setHomeSecondLevelCats] = useState<TCategory[]>(
    [],
  );

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [
      HEADER_HEIGHT - COMPACT_HEADER_HEIGHT - 20,
      HEADER_HEIGHT - COMPACT_HEADER_HEIGHT + 10,
    ],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Compact header translate for subtle slide
  const compactHeaderTranslate = scrollY.interpolate({
    inputRange: [
      HEADER_HEIGHT - COMPACT_HEADER_HEIGHT - 20,
      HEADER_HEIGHT - COMPACT_HEADER_HEIGHT + 10,
    ],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });
  const getGlobalCategories = async () => {
    try {
      const res = await apiClient.get('/buyer/categories');
      if (!res?.data.success) throw new Error(res?.data.message);
      setGlobalCats(res.data.categories);

      const {status, message, data} = await getHomeCats();

      setHomeCats(data.results);
      setHomeSecondLevelCats(data.level2Cats);
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location for a better experience!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await new Promise<Geolocation.GeoPosition>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        },
      );

      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log('Current location:', newCoords);
      setUserLocation(newCoords);

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...newCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    } catch (error: any) {
      console.log('Location error:', error.code, error.message);
      showToast('error', `Location error: ${error.message}`);
      if (error.code === 2) {
        Alert.alert(
          'Location Required',
          'Please enable device location services',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Settings', onPress: () => Linking.openSettings()},
          ],
        );
      }
    }
  };

  const initializeLocation = async () => {
    const {status, message, data} = await giveLocationPermission();
    if (status) {
      const displayAddress = data.address ?? data.formattedAddress;
      setAddressToShow(cleanAddress(displayAddress));
    }
  };

  const checkIsLocationEnabled = async () => {
    const locationEnableInfo = await isLocationEnabled();
    if (!locationEnableInfo) {
      setShowLocationSheet(true);
      return;
    }
    initializeLocation();
  };

  useEffect(() => {
    checkIsLocationEnabled();
    getGlobalCategories();
  }, []);

  const handleCardPress = (item: any) => {
    navigation.navigate('ShopListScreen', {category: item});
  };

  const handleAddressSelect = (address: string) => {
    // setConfirmedAddress(address);
    // You might want to update the location coordinates here as well
  };

  const handleHomeScreenLocation = () => {
    try {
      // setModalVisible(true);

      navigation.navigate('LocationConfirmationScreen');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLevel2CategoryPress = async (cat: TCategory) => {
    console.log('Pressed this category:::', cat);
  };

  const renderParentRow = useCallback(({item: parent}: {item: TParentCat}) => {
    return (
      <View style={styles.parentContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => console.log('Parent tapped', parent._id)}
          style={styles.parentTitleRow}>
          <Text style={styles.parentTitle}>{parent.name}</Text>
          {parent.image ? (
            <Image source={{uri: parent.image}} style={styles.parentThumb} />
          ) : null}
        </TouchableOpacity>

        <FlatList
          data={parent.children || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c: TChildCat) => c._id}
          renderItem={({item}: {item: TChildCat}) => (
            <TouchableOpacity
              style={styles.childWrap}
              activeOpacity={0.85}
              onPress={() =>
                console.log('Child tapped', item._id, 'under', parent._id)
              }>
              <Image
                source={
                  item.image
                    ? {uri: item.image}
                    : require('../../assets/images/boltix.png')
                }
                style={styles.childImage}
              />
              <Text numberOfLines={2} style={styles.childText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          contentContainerStyle={{paddingLeft: 8}}
        />
      </View>
    );
  }, []);

  // The combined header (hero image + HomeLevel2Cats + BannerCarousel)
  const ListHeader = useCallback(() => {
    return (
      <View>
        {/* Hero / ImageBackground header (same markup you had) */}
        <ImageBackground
          source={require('../../assets/images/header.png')}
          style={styles.headerContainer}
          imageStyle={styles.headerImage}
          resizeMode="cover">
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            {/* ... keep your headerTop, search box and tagline exactly as before */}
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.locationCard}
                activeOpacity={0.86}
                onPress={handleHomeScreenLocation}
                accessibilityRole="button"
                accessibilityLabel="Open location selector">
                <Icons
                  name="enviromento"
                  size={20}
                  color="#fff"
                  style={{fontWeight: 'bold'}}
                />
                <View style={styles.locationTextWrap}>
                  <View style={styles.nameRow}>
                    <Text style={styles.locationName}>
                      {name || 'Set location'}
                    </Text>
                    <Icons
                      name="down"
                      size={16}
                      color="rgba(255,255,255,0.9)"
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.locationAddressText}>
                    {addressToShow || 'Tap to set delivery location'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileIconButton}
                onPress={() => {}}
                activeOpacity={0.9}>
                {name && name.length > 0 ? (
                  <Text style={styles.initialsText}>
                    {getInitials(name as string)}
                  </Text>
                ) : (
                  <Icons name="user" size={18} color={Theme.colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.headerSearchRow}>
              <View style={styles.headerSearchBox}>
                <Icons
                  name="search1"
                  size={16}
                  color="rgba(255,255,255,0.95)"
                />
                <TextInput
                  placeholder="Search shops, products or categories"
                  placeholderTextColor="rgba(255,255,255,0.85)"
                  style={styles.headerSearchInput}
                />
              </View>
            </View>

            <View style={styles.headerTaglineWrap}>
              <Text style={styles.headerTagline}>All your local shops</Text>
              <Text style={styles.headerTagline}>just a tap away.</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Level-2 preview (horizontal) */}
        <HomeLevel2Cats
          level2Cats={homeSecondLevelCats}
          previewCount={12}
          onCategoryPress={handleLevel2CategoryPress}
        />

        {/* Banner carousel */}
        <BannerCarousel
          banners={bannerUrls}
          height={150}
          autoplayInterval={4000}
          onBannerPress={(url, i) => console.log('Pressed banner', url)}
        />
      </View>
    );
  }, [homeSecondLevelCats, bannerUrls, name, addressToShow]);

  return (
    <View style={styles.container}>
      {/* Compact sticky header shown after scrolling past hero */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.compactHeader,
          {
            opacity: compactHeaderOpacity,
            transform: [{translateY: compactHeaderTranslate}],
          },
        ]}>
        <View style={styles.compactInner}>
          <View style={styles.compactSearchBox}>
            <Icons name="search1" size={16} color="#fff" />
            <TextInput
              placeholder="Search shops, products or categories"
              placeholderTextColor="rgba(255,255,255,0.9)"
              style={[styles.headerSearchInput, {color: '#fff'}]}
            />
          </View>

          <TouchableOpacity
            style={styles.profileIconButtonSmall}
            onPress={() => {}}>
            {name && name.length > 0 ? (
              <Text style={styles.initialsTextSmall}>
                {getInitials(name as string)}
              </Text>
            ) : (
              <Icons name="user" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={homeCats}
        keyExtractor={item => item._id}
        renderItem={renderParentRow}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={9}
      />

      {/* Location modal and bottom sheet components remain unchanged */}
      {/* ... keep the Modal and LocationBottomSheet as in your original file */}
    </View>
  );
};

export default HomeScreen;

const colors = {
  primary: '#6C5CE7', // Sophisticated purple
  secondary: '#FF9F43', // Warm orange
  background: '#F8F9FA', // Light background
  text: '#2D3436', // Dark text
  darkGray: '#636E72', // Secondary text
  lightGray: '#DFE6E9', // Borders
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  locationSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
    color: Theme.colors.primary,
  },
  locationTitle: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 7,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 24,
    textAlign: 'center',
    lineHeight: 32,
  },
  // gridContainer: {
  //   paddingBottom: 24,
  // },
  categoryIcon: {
    backgroundColor: '#F0F2FE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },

  locationButtonText: {
    marginLeft: 10,
    color: '#003366',
    fontWeight: 'bold',
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderWidth: 1, // Subtle border
    borderColor: '#E0E0E0', // Light gray for professionalism
    borderRadius: 8, // Rounded corners
    backgroundColor: '#FFFFFF', // Clean white background
    elevation: 2, // Subtle shadow for depth
    paddingBottom: 3, // Internal spacing
  },
  categoryContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 8, // Space at the bottom
  },
  imageContainer: {
    width: '100%',
    height: 100, // Increased height for better image visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 8, // Rounded top corners
  },
  categoryImage: {
    width: '100%', // Slightly less than full width for padding
    height: '100%', // Maintains aspect ratio
    resizeMode: 'cover', // Ensures image fits without distortion
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600', // Slightly bold for a polished look
    color: '#333', // Dark gray for readability
    marginTop: 8, // Space between image and text
    textAlign: 'center', // Center text for consistency
  },
  gridContainer: {
    padding: 10, // Padding around the grid
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // markerPulse: {
  //   position: 'absolute',
  //   backgroundColor: '#00336622',
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   zIndex: -1,
  // },
  // Ensure your map has proper dimensions
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8, // Use 80% of screen height
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -40,
    alignItems: 'center',
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 51, 102, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    top: -5,
    zIndex: -1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: Theme.colors.bharatPurple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: Theme.colors.bharatPurple,
    padding: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  logoutPill: {
    marginLeft: 12,
    backgroundColor: Theme.colors.baseYellow,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutPillText: {
    color: '#111',
    fontWeight: '600',
  },

  headerMapButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Theme.colors.bharatPurple,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  headerContainer: {
    width: '100%',
    height: HEADER_HEIGHT,
  },
  headerImage: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    // optionally slightly desaturate or blur the image in edit tools, not necessary here
  },

  // overlay to darken image slightly -> improves legibility
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)', // tweak 0.2–0.36 to taste
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  // wrapper to layer content on top of the overlay
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 22 : 16,
    paddingBottom: 18,
    justifyContent: 'flex-start',
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Location card: semi-transparent so it feels like a panel on top of the hero */
  locationCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,255,255,0.10)', // soft translucent white
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    // subtle inner shadow impression on iOS (android will ignore)
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    marginRight: 12,
  },

  locationTextWrap: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginRight: 6,
  },

  locationAddressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },

  /* Profile icon: white circular button so it stands out against amber background */
  profileIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff', // white contrast
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },

  initialsText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Search box: translucent, inverted text color to white */
  headerSearchRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)', // translucent
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgb(255, 216, 139)',
  },

  headerSearchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 17,
    color: '#fff', // input text white
    padding: 0,
    fontWeight: '500',
  },

  /* Tagline centered and big, white */
  headerTaglineWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },

  headerTagline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
    fontStyle: 'italic',
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COMPACT_HEADER_HEIGHT,
    backgroundColor: Theme.colors.bharatPurple, // use your theme color
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 18 : 8,
    zIndex: 20,
    elevation: 10,
  },

  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  compactSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    marginRight: 10,
  },

  profileIconButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  initialsTextSmall: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  parentContainer: {
    marginBottom: 18,
    paddingHorizontal: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },

  childWrap: {
    width: 78,
    alignItems: 'center',
  },

  childImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f4f4f4',
    borderWidth: 0.5,
    borderColor: '#e2e2e2',
  },

  childText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    width: 72,
    color: '#222',
  },
});

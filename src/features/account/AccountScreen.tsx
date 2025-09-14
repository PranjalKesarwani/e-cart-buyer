// AccountScreen.tsx
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../../theme/theme';
import {useAppSelector} from '../../redux/hooks';
import {goBack} from '../../navigation/navigationService';
import {handleLogout} from '../../services/apiService';

/**
 * Production-ready Account screen
 *
 * - Replace pickImage(...) stub with a real image-picker (react-native-image-picker / expo-image-picker).
 * - Hook name & profile image to your Redux / server update endpoints.
 */

const AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/300'; // replace with your default asset if you have one

const AccountScreen: React.FC = () => {
  const {name: reduxName, profilePic} = useAppSelector(
    state => state.buyer || {},
  );
  const name = reduxName || 'Your Name';

  const [avatar, setAvatar] = useState<string | null>(profilePic ?? null);
  const [showImageModal, setShowImageModal] = useState(false);

  // stubbed image pick flow - replace with your library of choice
  const pickImage = useCallback(async () => {
    // Example: use react-native-image-picker or expo-image-picker here
    // const result = await launchImageLibrary({mediaType: 'photo'});
    // if (!result.didCancel && result.assets?.length) setAvatar(result.assets[0].uri);
    Alert.alert(
      'Image picker',
      'Plug your image picker here (react-native-image-picker).',
    );
    setShowImageModal(false);
  }, []);

  const openCamera = useCallback(async () => {
    // similar to pickImage but open camera
    Alert.alert('Camera', 'Plug your camera flow here.');
    setShowImageModal(false);
  }, []);

  const onLogout = useCallback(async () => {
    // call your logout function which handles navigation/cleanup
    const res = await handleLogout();
    // handleLogout should manage navigation; if not, navigate explicitly.
    if (!res?.status) {
      Alert.alert('Logout failed', 'Please try again.');
    }
  }, []);

  return (
    <View style={styles.screen}>
      {/* Top navigation row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icons
            name="arrowleft"
            size={20}
            color={Theme.colors.darkText ?? '#111'}
          />
        </TouchableOpacity>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <TouchableOpacity
          style={styles.avatarWrap}
          activeOpacity={0.85}
          onPress={() => setShowImageModal(true)}
          accessibilityLabel="Edit profile picture">
          <Image
            source={{uri: avatar ?? AVATAR_PLACEHOLDER}}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.editBadge}>
            <Icons name="edit" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert('Edit name', 'Hook your name edit flow here')
            }
            style={styles.editNameBtn}
            accessibilityRole="button">
            <Icons name="edit" size={14} color={Theme.colors.bharatPurple} />
            <Text style={styles.editNameText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action list */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionRow}
          activeOpacity={0.8}
          onPress={() => {
            // navigate to orders screen
            // navigation.navigate('OrdersScreen');
            Alert.alert('Orders', 'Open Orders screen');
          }}
          accessibilityRole="button"
          accessibilityLabel="Orders">
          <View style={styles.actionLeft}>
            <Icons name="profile" size={20} color={Theme.colors.primary} />
            <Text style={styles.actionTitle}>Orders</Text>
          </View>
          <Icons name="right" size={18} color={Theme.colors.darkGray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          activeOpacity={0.8}
          onPress={() => {
            // navigation.navigate('WishListScreen');
            Alert.alert('Wishlist', 'Open Wishlist');
          }}
          accessibilityRole="button"
          accessibilityLabel="Wishlist">
          <View style={styles.actionLeft}>
            <Icons name="heart" size={20} color={Theme.colors.primary} />
            <Text style={styles.actionTitle}>Wishlist</Text>
          </View>
          <Icons name="right" size={18} color={Theme.colors.darkGray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          activeOpacity={0.8}
          onPress={() => {
            // navigation.navigate('SettingsScreen');
            Alert.alert('Settings', 'Open Settings');
          }}
          accessibilityRole="button"
          accessibilityLabel="Settings">
          <View style={styles.actionLeft}>
            <Icons name="setting" size={20} color={Theme.colors.primary} />
            <Text style={styles.actionTitle}>Settings</Text>
          </View>
          <Icons name="right" size={18} color={Theme.colors.darkGray} />
        </TouchableOpacity>
      </View>

      {/* Logout area */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Logout">
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Image modal */}
      <Modal
        visible={showImageModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowImageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change profile photo</Text>

            <TouchableOpacity style={styles.modalAction} onPress={pickImage}>
              <Text style={styles.modalActionText}>Choose from gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalAction} onPress={openCamera}>
              <Text style={styles.modalActionText}>Take a new photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalAction, styles.cancelAction]}
              onPress={() => setShowImageModal(false)}>
              <Text style={[styles.modalActionText, {color: '#333'}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountScreen;

/* Styles */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.colors.background ?? '#F7F8FA',
  },
  topRow: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    // subtle iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 6,
  },
  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 92 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: Theme.colors.bharatPurple,
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.darkText ?? '#111',
  },
  editNameBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNameText: {
    marginLeft: 6,
    color: Theme.colors.bharatPurple,
    fontWeight: '600',
  },

  actionsContainer: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    // card shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomColor: '#F2F4F6',
    borderBottomWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    marginLeft: 12,
    fontSize: 16,
    color: Theme.colors.darkText ?? '#222',
    fontWeight: '600',
  },

  logoutContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Theme.colors.baseYellow,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    // elevated
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  logoutText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 16,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12,12,12,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 22,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalAction: {
    paddingVertical: 14,
  },
  modalActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.darkText ?? '#111',
  },
  cancelAction: {
    marginTop: 6,
  },
});

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../theme/theme';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import {addBuyerAddress} from '../../services/apiService';

type AddressInputProps = NativeStackScreenProps<
  RootStackParamList,
  'AddressInputScreen'
>;

const AddressInputScreen = ({route, navigation}: AddressInputProps) => {
  const {
    formattedAddress,
    markerPosition,
  }: {formattedAddress: string; markerPosition: any} = route.params;
  const [addressInput, setAddressInput] = useState({
    floor: '',
    landmark: '',
    completeAddress: '',
  });

  const [addressType, setAddressType] = useState<
    'Home' | 'Work' | 'Hotel' | 'Other'
  >('Home');
  const [isLoading, setIsLoading] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1000, 0], // Increase this value for smoother entry
  });

  const handleSubmit = async () => {
    if (!addressInput.completeAddress.trim()) {
      showToast('error', 'Please enter complete address');
      return;
    }
    setIsLoading(true);
    const payload = {
      addressType,
      completeAddress: addressInput.completeAddress,
      floor: addressInput.floor,
      landmark: addressInput.landmark,
      isDefault: false,
      formattedAddress,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(markerPosition.latitude),
          parseFloat(markerPosition.longitude),
        ],
      },
    };

    const res = await addBuyerAddress(payload);

    if (res?.status) {
      showToast('success', res.message);
      navigation.navigate('DrawerNavigator');
    } else {
      showToast('error', res?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={[styles.content, {transform: [{translateY}]}]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <Icons name="close" size={24} color={Theme.colors.gray} />
          </TouchableOpacity>
          <Text style={styles.title}>Enter Complete Address</Text>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address Type</Text>
              <TouchableOpacity
                style={styles.typePicker}
                onPress={() => setShowTypePicker(true)}>
                <Text style={styles.typePickerText}>{addressType}</Text>
                <Icons
                  name="arrow-drop-down"
                  size={24}
                  color={Theme.colors.gray}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.selectedLocation}
                placeholder="House number, street, area"
                placeholderTextColor={Theme.colors.lightGray}
                value={formattedAddress}
                editable={false}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Complete Address</Text>
              <TextInput
                style={styles.input}
                placeholder="House number, street, area"
                placeholderTextColor={Theme.colors.lightGray}
                value={addressInput.completeAddress}
                onChangeText={text =>
                  setAddressInput({...addressInput, completeAddress: text})
                }
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, {flex: 1, marginRight: 10}]}>
                <Text style={styles.inputLabel}>Floor (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 3rd Floor"
                  placeholderTextColor={Theme.colors.lightGray}
                  value={addressInput.floor}
                  onChangeText={text =>
                    setAddressInput({...addressInput, floor: text})
                  }
                />
              </View>

              <View style={[styles.inputContainer, {flex: 1}]}>
                <Text style={styles.inputLabel}>Landmark (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nearby famous place"
                  placeholderTextColor={Theme.colors.lightGray}
                  value={addressInput.landmark}
                  onChangeText={text =>
                    setAddressInput({...addressInput, landmark: text})
                  }
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirm Address</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Address Type Picker Modal */}
        {showTypePicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {(['Home', 'Work', 'Hotel', 'Other'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalItem}
                  onPress={() => {
                    setAddressType(type);
                    setShowTypePicker(false);
                  }}>
                  <Text
                    style={[
                      styles.modalText,
                      addressType === type && styles.selectedType,
                    ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '90%', // Changed from height to maxHeight
    minHeight: '85%', // Ensure minimum height
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.darkText,
    marginRight: 24,
  },
  formContainer: {
    paddingBottom: 100,
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    marginBottom: 8,
  },
  selectedLocation: {
    backgroundColor: Theme.colors.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    color: Theme.colors.gray,
    fontFamily: Theme.fonts.body,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
  },
  input: {
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Theme.colors.darkText,
    fontFamily: Theme.fonts.body,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
  },
  typePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.lightBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
  },
  typePickerText: {
    fontSize: 16,
    color: Theme.colors.darkText,
    fontFamily: Theme.fonts.body,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    position: 'absolute',
    left: 5,
    bottom: 0,
    backgroundColor: Theme.colors.primary,
    height: 56,
    width: '98%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  modalText: {
    fontSize: 16,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.darkText,
  },
  selectedType: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default AddressInputScreen;

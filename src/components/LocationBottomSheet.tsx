import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../theme/theme';

interface LocationBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  savedAddresses: string[];
  onEnableLocation: () => Promise<void>;
  onAddressSelect: (address: string) => void;
}

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  isVisible,
  onClose,
  savedAddresses,
  onEnableLocation,
  onAddressSelect,
}) => {
  if (!isVisible) return null;

  const hasAddresses = savedAddresses.length > 0;
  const sheetHeight = hasAddresses
    ? Dimensions.get('window').height * 0.5
    : Dimensions.get('window').height * 0.3;

  return (
    <View style={styles.overlay}>
      {/* Touchable to dismiss when tapping outside */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={[styles.container, {height: sheetHeight}]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icons name="close" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Enable Location Button */}
        <TouchableOpacity
          style={styles.enableButton}
          onPress={async () => {
            await onEnableLocation();
            onClose();
          }}>
          <Text style={styles.buttonText}>Enable Location Services</Text>
        </TouchableOpacity>

        {/* Saved Addresses List */}
        {hasAddresses ? (
          <>
            <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>
            <FlatList
              data={savedAddresses.slice(0, 2)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.addressItem}
                  onPress={() => {
                    onAddressSelect(item);
                    onClose();
                  }}>
                  <Icons
                    name="enviromento"
                    size={20}
                    color={Theme.colors.primary}
                  />
                  <Text style={styles.addressText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Icons
              name="enviromento"
              size={40}
              color={Theme.colors.lightGray}
            />
            <Text style={styles.emptyText}>No saved addresses found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // translucent black
    justifyContent: 'flex-end', // keep the sheet at the bottom
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  enableButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: Theme.colors.darkGray,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.lightGray,
  },
  addressText: {
    marginLeft: 12,
    fontSize: 14,
    color: Theme.colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: Theme.colors.darkGray,
    fontSize: 14,
    marginTop: 8,
  },
});

export default LocationBottomSheet;

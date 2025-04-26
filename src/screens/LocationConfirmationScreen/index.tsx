import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../theme/theme';

const LocationConfirmationScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(
    'SHANKAR LAL PUBLIC SCHOOL',
  );
  const [locationPermissionEnabled, setLocationPermissionEnabled] =
    useState(false);

  const LocationItem = ({title, address}: {title: string; address: string}) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => setSelectedLocation(title)}>
      <View style={styles.locationIcon}>
        <Icon name="location-pin" size={24} color="#4a90e2" />
      </View>
      <View style={styles.locationTextContainer}>
        <Text style={styles.locationTitle}>{title}</Text>
        <Text style={styles.locationAddress}>{address}</Text>
      </View>
      {selectedLocation === title && (
        <Text style={styles.deliveryNote}>
          Your order will be delivered here
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirm delivery location</Text>
      <Text style={styles.subHeader}>Swami Vivekanand</Text>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for area, street name..."
          placeholderTextColor="#999"
        />
      </View>

      <LocationItem title="SHANKAR LAL PUBLIC SCHOOL" address="Sahson Rd" />

      <TouchableOpacity style={styles.movePinButton}>
        <Text style={styles.movePinText}>Move pin to your exact location</Text>
      </TouchableOpacity>

      <LocationItem title="VIKAS INTER COLLEGE" address="Ranxi sex aria" />

      {!locationPermissionEnabled && (
        <View style={styles.permissionAlert}>
          <Text style={styles.permissionTitle}>
            Location permission not enabled
          </Text>
          <Text style={styles.permissionText}>
            Please enable location permission to give us your exact delivery
            address
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>
          Continue with{' '}
          <Text style={styles.boldAddress}>Jhunsi Rd, Sahson...</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  header: {
    fontSize: 32,
    fontFamily: Theme.fonts.heading,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subHeader: {
    fontSize: 18,
    fontFamily: Theme.fonts.body,
    fontWeight: '600',
    color: Theme.colors.gray,
    marginBottom: Theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.primary,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: Theme.spacing.sm,
    color: Theme.colors.text,
    fontSize: 16,
    fontFamily: Theme.fonts.body,
  },
  locationItem: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.card,
  },
  locationIcon: {
    position: 'absolute',
    left: Theme.spacing.lg,
    top: Theme.spacing.lg,
  },
  locationTextContainer: {
    marginLeft: 40,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.xs,
  },
  deliveryNote: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    marginTop: Theme.spacing.md,
  },
  movePinButton: {
    backgroundColor: Theme.colors.lightPrimary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary + '33',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  movePinText: {
    color: Theme.colors.primary,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
  },
  permissionAlert: {
    backgroundColor: Theme.colors.warningBackground,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginVertical: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.warningBorder,
  },
  permissionTitle: {
    color: Theme.colors.warningText,
    fontFamily: Theme.fonts.heading,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  permissionText: {
    color: Theme.colors.warningText,
    fontSize: 14,
    fontFamily: Theme.fonts.body,
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    marginTop: 'auto',
    ...Theme.shadows.button,
  },
  continueButtonText: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
  },
  boldAddress: {
    fontWeight: '700',
  },
});

export default LocationConfirmationScreen;

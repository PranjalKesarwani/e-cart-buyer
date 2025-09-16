// components/common/Header.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode; // e.g. <Icons name="search" .../>
};

const Header: React.FC<HeaderProps> = ({title, onBack, rightIcon}) => {
  return (
    <View style={styles.container}>
      {/* Left Section (Back Button) */}
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icons name="arrowleft" size={22} color="#111" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Section (Optional Action) */}
      <View style={styles.rightContainer}>
        {rightIcon || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  placeholder: {
    width: 30, // keeps title centered if no back/right
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111',
  },
  rightContainer: {
    width: 30,
    alignItems: 'flex-end',
  },
});

export default Header;

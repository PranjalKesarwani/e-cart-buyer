import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BidScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Bidding Screen Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default BidScreen;

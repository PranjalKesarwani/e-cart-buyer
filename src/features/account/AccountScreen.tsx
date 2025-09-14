import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {goBack} from '../../navigation/navigationService';

const AccountScreen = () => {
  return (
    <View
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => goBack()}>
        <Text>AccountScreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

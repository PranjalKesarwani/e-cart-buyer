import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../types';

type AllChatScreenProps = NativeStackScreenProps<RootStackParamList, 'AllChatScreen'>;

const AllChatScreen = ({ navigation }: AllChatScreenProps) => {
  const chatData = Array.from({ length: 20 }, (_, i) => `chat${i + 1}`);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PersonalChatScreen')}>
      <View style={styles.card}>
        <Text style={styles.cardText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AllChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
  },
});

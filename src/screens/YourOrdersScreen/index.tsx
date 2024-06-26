import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types';

type YourOrdersScreenProps = NativeStackScreenProps<RootStackParamList, 'YourOrdersScreen'>;

const orders = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  name: `Order #${i + 1}`,
  date: `2024-05-${i + 1 < 10 ? '0' : ''}${i + 1}`,
  image: 'https://m.media-amazon.com/images/I/51HeJHJmXXL._AC_UY1000_.jpg', // Placeholder image
}));

const YourOrdersScreen = ({ navigation }: YourOrdersScreenProps) => {

  const renderItem = ({ item }: { item: { id: string, name: string, date: string, image: string } }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrderedItemDetailScreen')}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('DrawerNavigator')}
        style={styles.button}>
        <Text style={styles.buttonText}>Go to Home screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YourOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

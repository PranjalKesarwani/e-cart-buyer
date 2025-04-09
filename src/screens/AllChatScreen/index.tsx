import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMessage, RootStackParamList, TChatContact, TShop} from '../../types';
import {apiClient} from '../../services/api';
import moment from 'moment';

type AllChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AllChatScreen'
>;
type TChatContactAllScreen = {
  chatContactId: string;
  userType: 'Buyer' | 'Seller' | 'DeliveryPerson' | 'Admin';
  lastMessage: {
    content: {
      text: string;
      media: string[];
    };
    _id: string;
    sender: string;
    senderOnModel: 'Buyer' | 'Seller' | 'DeliveryPerson' | 'Admin';
    type: 'text' | 'image' | 'video' | string; // adjust based on your enum
    status: 'sent' | 'delivered' | 'read' | string; // adjust as needed
    timestamp: number;
  };
  updatedAt: string;
  shop?: {
    shopName: string;
    shopPic: string;
  };
};
// Mock data structure similar to WhatsApp
const chatData = Array.from({length: 20}, (_, i) => ({
  id: `chat${i + 1}`,
  name: `Contact ${i + 1}`,
  lastMessage: 'Last message preview...',
  timestamp: '10:30 AM',
  unreadCount: Math.floor(Math.random() * 5),
  online: i % 4 === 0, // mock online status
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`, // placeholder images
}));

const AllChatScreen = ({navigation}: AllChatScreenProps) => {
  const [chatContacts, setChatContacts] = useState<TChatContact[] | null>(null);
  useEffect(() => {
    const getChatContacts = async () => {
      try {
        const res = await apiClient.get('/buyer/get-chat-contacts');
        console.log('Chat contacts fetched successfully:', res.data);
        setChatContacts(res.data.chatContacts);
      } catch (error) {
        console.log('Error fetching chat contacts:', error);
      }
    };
    getChatContacts();
  }, []);

  const getShopData = (item: TChatContact) => {
    const sellerParticipant = item.participants.find(
      participant => participant.onModel === 'Seller',
    );
    const shopPic = sellerParticipant?.shop?.shopPic;
    const shopName = sellerParticipant?.shop?.shopName;
    const shop = sellerParticipant?.shop;

    return {shopPic, shopName, shop};
  };
  const renderItem = ({item}: {item: TChatContact}) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Chat item pressed:', item.participants);
        const shopInfo = getShopData(item);
        const shop = shopInfo.shop as TShop;
        navigation.navigate('PersonalChatScreen', {shop});
      }}
      style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: getShopData(item).shopPic}}
          style={styles.avatar}
        />
        {/* {item.online && <View style={styles.onlineIndicator} />} */}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.headerRow}>
          <Text style={styles.contactName}>{getShopData(item).shopName}</Text>
          <Text style={styles.timestamp}>
            {' '}
            {moment
              .unix((item.lastMessage as IMessage).timestamp)
              .format('h:mm A')}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail">
            {(item.lastMessage as IMessage).content.text}
          </Text>
          {/* {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatContacts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#667781',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#667781',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
    marginLeft: 82,
  },
});

export default AllChatScreen;

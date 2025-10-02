import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  EMessageStatus,
  IMessage,
  RootStackParamList,
  TChatContact,
  TSeller,
  TShop,
} from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import socket from '../../utils/socket';
import {useAppSelector} from '../../redux/hooks';
import {
  handleContinuousChat,
  handleCreatedChat,
} from '../../utils/socketHelper';
import moment from 'moment';
import {PersonalChtatStyles as styles} from '../../theme/styles';

type PersonalChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PersonalChatScreen'
>;

const PersonalChatScreen = ({route, navigation}: PersonalChatScreenProps) => {
  const {shop}: {shop: TShop} = route.params;
  const [chatContact, setChatContact] = useState<TChatContact | null>(null);
  const {_id: buyerId} = useAppSelector(state => state.buyer);
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThisChatExist, setIsThisChatExist] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post('/buyer/get-chat-screen', {
          sellerId: (shop.sellerId as TSeller)._id,
        });
        setIsThisChatExist(res.data.isChatExist);
        setChatContact(res.data.chat);
        setMessages(res.data.messages);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Something went wrong';
        showToast('error', errorMessage);
      }
    };
    getMessages();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      let payload: any = {};
      if (!isThisChatExist) {
        payload = {
          buyerId,
          sellerId: (shop.sellerId as TSeller)._id,
          message: newMessage,
          messageType: 'text',
        };
      } else {
        payload = {
          chatContactId: chatContact?._id,
          message: newMessage,
          messageType: 'text',
          sender: buyerId,
          senderOnModel: 'Buyer',
        };
      }

      socket.emit(
        `${isThisChatExist ? 'sendPrivateMessage' : 'initiateChat'}`,
        payload,
      );
    }
  };

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <MaterialIcon name="done" size={16} color="#667781" />;
      case 'delivered':
        return <MaterialIcon name="done-all" size={16} color="#667781" />;
      case 'read':
        return <MaterialIcon name="done-all" size={16} color="#53BDEB" />;
      case 'pending':
        return <MaterialIcon name="schedule" size={16} color="#667781" />;
      default:
        return null;
    }
  };

  const renderItem = ({item}: {item: IMessage}) => (
    <View
      style={[
        styles.messageContainer,
        item.senderOnModel === 'Buyer'
          ? styles.userContainer
          : styles.otherContainer,
      ]}>
      {item.senderOnModel === 'Seller' && (
        <Image
          source={{uri: (shop.sellerId as TSeller)?.profilePic}}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.senderOnModel === 'Buyer'
            ? styles.userBubble
            : styles.otherBubble,
        ]}>
        <Text style={styles.messageText}>{item.content.text}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {moment.unix(item.timestamp).format('h:mm A')}
          </Text>
          {item.senderOnModel === 'Buyer' && renderMessageStatus(item.status)}
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    // Handler for new private messages

    // Listen for the 'newPrivateMessage' event from the server
    socket.on('chatCreated', (data: TChatContact) => {
      handleCreatedChat(data, setMessages, setChatContact);
      setNewMessage('');
    });
    socket.on('messageSent', (data: IMessage) => {
      handleContinuousChat(data, setMessages);
      setNewMessage('');
    });
    socket.on('newPrivateMessage', (data: IMessage) => {
      handleContinuousChat(data, setMessages);
      socket.emit('read', {
        messageId: data._id,
        chatContactId: chatContact?._id,
      });
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === data._id
            ? {...msg, status: 'read' as EMessageStatus.READ}
            : msg,
        ),
      );
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stopTyping', () => {
      console.log('hello--------___________');
      setIsTyping(false);
    });
    socket.on('userJoined', () => {
      setIsUserOnline(true);
    });
    socket.on('userLeft', () => {
      setIsUserOnline(false);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('chatCreated', (data: TChatContact) => {
        handleCreatedChat(data, setMessages, setChatContact);
        setNewMessage('');
      });
      socket.off('messageSent', (data: IMessage) => {
        handleContinuousChat(data, setMessages);
        setNewMessage('');
      });
      socket.off('newPrivateMessage', (data: IMessage) => {
        handleContinuousChat(data, setMessages);
      });
      socket.off('typing', () => setIsTyping(true));
      socket.off('stopTyping', () => setIsTyping(false));
      socket.on('userJoined', () => {
        setIsUserOnline(true);
      });
      socket.on('userLeft', () => {
        setIsUserOnline(false);
      });
    };
  }, []);

  useEffect(() => {
    if (isThisChatExist && chatContact?._id) {
      socket.emit('joinPrivateChat', {chatContactId: chatContact._id});
      console.log(`Joined private chat with ID: ${chatContact._id}`);
    }
  }, [isThisChatExist, chatContact]);

  useEffect(() => {
    if (!isThisChatExist || !chatContact?._id) return;

    // Emit "typing" event
    if (newMessage.trim()) {
      socket.emit('typing', {
        chatContactId: chatContact._id,
      });

      // Clear existing timer if still typing
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      // Set a new timer to emit "stopTyping" after delay
      typingTimeout.current = setTimeout(() => {
        socket.emit('stopTyping', {
          chatContactId: chatContact._id,
        });
      }, 1500); // 1.5 seconds of no typing = stop typing
    } else {
      // If text is cleared
      socket.emit('stopTyping', {
        chatContactId: chatContact._id,
      });
    }
  }, [newMessage]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{uri: 'https://i.pravatar.cc/150?img=5'}}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>
            {shop.shopName}
            {/* {chatContact?.participants.find(p => p.onModel === "Seller" && p.userId)?.userId?.sellerName || "N/A"} */}
          </Text>
          <Text style={styles.statusText}>
            {isTyping ? 'typing...' : isUserOnline ? 'online' : 'offline'}
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        inverted
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.plusButton}>
          <Icon name="pluscircleo" size={24} color="#667781" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton}>
          <MaterialIcon name="camera-alt" size={24} color="#667781" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#667781"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          {newMessage ? (
            <MaterialIcon name="send" size={24} color="white" />
          ) : (
            <MaterialIcon name="mic" size={24} color="#667781" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PersonalChatScreen;

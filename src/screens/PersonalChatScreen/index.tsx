import React, {useEffect, useState} from 'react';
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
import {RootStackParamList, TShop} from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';

type PersonalChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PersonalChatScreen'
>;

const PersonalChatScreen = ({route, navigation}: PersonalChatScreenProps) => {
  // const {shop}:{shop:TShop} = route;
  const [messages, setMessages] = useState(
    Array.from({length: 50}, (_, i) => ({
      id: i.toString(),
      text: `Message ${i + 1}`,
      sender: i % 2 === 0 ? 'user' : 'other',
      time: '10:30 AM',
      status: i % 3 === 0 ? 'sent' : i % 3 === 1 ? 'delivered' : 'read',
    })),
  );
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await apiClient.get('/buyer/get-chat-screen');
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', messages);
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
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
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
      default:
        return null;
    }
  };

  const renderItem = ({item}: {item: (typeof messages)[0]}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userContainer : styles.otherContainer,
      ]}>
      {item.sender === 'other' && (
        <Image
          source={{uri: 'https://i.pravatar.cc/150?img=5'}}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.otherBubble,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.sender === 'user' && renderMessageStatus(item.status)}
        </View>
      </View>
    </View>
  );

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
          <Text style={styles.userName}>Pranjal</Text>
          <Text style={styles.statusText}>
            {isTyping ? 'typing...' : 'online'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <FontAwesome
            name="video-camera"
            size={20}
            color="white"
            style={styles.iconSpacing}
          />
          <MaterialIcon
            name="call"
            size={24}
            color="white"
            style={styles.iconSpacing}
          />
          <MaterialIcon name="more-vert" size={24} color="white" />
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1317',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1F2C34',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222D34',
  },
  backButton: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  statusText: {
    color: '#8696A0',
    fontSize: 13,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 25,
  },
  listContent: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#005D4B',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#1F2C34',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    color: '#8696A0',
    fontSize: 12,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#1F2C34',
  },
  plusButton: {
    marginHorizontal: 4,
  },
  cameraButton: {
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A3942',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00A884',
    borderRadius: 20,
    padding: 10,
    marginLeft: 4,
  },
});

export default PersonalChatScreen;

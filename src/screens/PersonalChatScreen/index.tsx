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
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ChatItem,
  EMessageStatus,
  EMessageType,
  IDateSeparator,
  IMedia,
  IMessage,
  ReplyToMessage,
  ReplyToOrder,
  ReplyToProduct,
  RootStackParamList,
  TChatContact,
  TSelectedImageFromDevice,
  TSeller,
  TShop,
} from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {showToast} from '../../utils/toast';
import {apiClient} from '../../services/api';
import socket from '../../utils/socket';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  handleContinuousChat,
  handleCreatedChat,
} from '../../utils/socketHelper';
import moment from 'moment';
import {PersonalChtatStyles as styles} from '../../theme/styles';
import {addDateSeparators} from '../../utils/helper';
import Clipboard from '@react-native-clipboard/clipboard';
import {Theme} from '../../theme/theme';
import ChatImagePreviewModal from '../../components/common/ChatImagePreviewModal';
import ImagePicker from 'react-native-image-crop-picker';
import {generateUniqueId} from '../../utils/util';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';
import {sendMediaForUploadingForChat} from '../../services/apiService';
import {updateLastMessage} from '../../redux/slices/chatSlice';

type PersonalChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PersonalChatScreen'
>;

const PersonalChatScreen = ({route, navigation}: PersonalChatScreenProps) => {
  const {shop}: {shop: TShop} = route.params;
  const [chatContact, setChatContact] = useState<TChatContact | null>(null);
  const {socketId} = useAppSelector(state => state.chatSlice);
  const dispatch = useAppDispatch();
  const {_id: buyerId} = useAppSelector(state => state.buyer);
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [newMessage, setNewMessage] = useState<string | IMedia>('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isThisChatExist, setIsThisChatExist] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [caption, setCaption] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState<boolean>(false);

  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null,
  );

  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);
  const [previewImage, setPreviewImage] =
    useState<TSelectedImageFromDevice | null>(null);
  const [isChatImagePreviewVisible, setIsChatImagePreviewVisible] =
    useState(false);

  const getMessages = async (pageNumber: number) => {
    try {
      if (isLoading || !hasMoreMessages) return;
      setIsLoading(true);
      const res = await apiClient.post('/buyer/get-chat-screen', {
        sellerId: (shop.sellerId as TSeller)._id,
        page: pageNumber, // 👈 Pass the page number
        limit: 20,
      });
      // setIsThisChatExist(res.data.isChatExist);
      // setChatContact(res.data.chat);
      // setMessages(res.data.messages);
      const {messages: newMessages, totalMessagesCount} = res.data;

      const totalLoadedMessages = messages.length + newMessages.length;
      setHasMoreMessages(totalLoadedMessages < totalMessagesCount);

      if (pageNumber === 1) {
        setMessages(newMessages); // 👈 For the first load, set the messages
      } else {
        setMessages(prevMessages => [...prevMessages, ...newMessages]); // 👈 Append new messages
      }
      setPage(pageNumber);

      setIsThisChatExist(res.data.isChatExist);
      setChatContact(res.data.chat);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages(1);
  }, []);

  const loadMoreMessages = () => {
    if (!isLoading && hasMoreMessages) {
      console.log('Loading more messages for page:', page + 1);
      getMessages(page + 1);
    }
  };

  // const togglePlayback = async (voiceUri: string, index: number) => {
  //   try {
  //     if (currentPlayingIndex === index && isPlaying) {
  //       // Pause current playback
  //       await audioRecorderPlayer.pausePlayer();
  //       setIsPlaying(false);
  //     } else {
  //       // Stop any currently playing audio
  //       if (currentPlayingIndex !== null) {
  //         await audioRecorderPlayer.stopPlayer();
  //         audioRecorderPlayer.removePlayBackListener();
  //       }

  //       setLoadingAudio(true);

  //       // Start playing new audio
  //       await audioRecorderPlayer.startPlayer(voiceUri);
  //       audioRecorderPlayer.addPlayBackListener(e => {
  //         if (e.currentPosition === e.duration) {
  //           // Audio finished playing
  //           setCurrentPlayingIndex(null);
  //           setIsPlaying(false);
  //           setLoadingAudio(false);
  //           audioRecorderPlayer.removePlayBackListener();
  //         }
  //       });

  //       setCurrentPlayingIndex(index);
  //       setIsPlaying(true);
  //       setLoadingAudio(false);
  //     }
  //   } catch (error) {
  //     console.error('Error playing voice:', error);
  //     showToast('error', 'Could not play audio');
  //     setLoadingAudio(false);
  //   }
  // };

  const sendMessage = () => {
    const tempId = generateUniqueId();
    if ((newMessage as string) !== '') {
      let payload: any = {};
      if (!isThisChatExist) {
        payload = {
          tempId: tempId,
          buyerId,
          sellerId: (shop.sellerId as TSeller)._id,
          message: newMessage as string,
          messageType: 'text',
        };
        // if (replyingTo) {
        //   if ('content' in replyingTo) {
        //     payload.replyingTo = (replyingTo as IMessage)._id;
        //     payload.replyingToType = 'Message';
        //   } else if (replyingTo.onModel === 'Order') {
        //     payload.replyingTo = (replyingTo as ReplyToOrder).mainId;
        //     payload.replyingToType = 'Order';
        //   } else if (replyingTo.onModel === 'Product') {
        //     payload.replyingTo = replyingTo.mainId;
        //     payload.replyingToType = 'Product';
        //   }
        // }
      } else {
        payload = {
          tempId: tempId,
          chatContactId: chatContact?._id,
          message: newMessage,
          messageType: 'text',
          sender: buyerId,
          senderOnModel: 'Buyer',
        };
        // if (replyingTo) {
        //   if ('content' in replyingTo) {
        //     payload.replyingTo = replyingTo._id;
        //     payload.replyingToType = 'Message';
        //   } else if (replyingTo.onModel === 'Order') {
        //     payload.replyingTo = replyingTo.mainId;
        //     payload.replyingToType = 'Order';
        //   } else if (replyingTo.onModel === 'Product') {
        //     payload.replyingTo = replyingTo.mainId;
        //     payload.replyingToType = 'Product';
        //   }
        // }
      }

      socket.emit(
        `${isThisChatExist ? 'sendPrivateMessage' : 'initiateChat'}`,
        payload,
      );

      // const message: IMessage = {
      //   _id: `temp-${Date.now()}`, // Temporary ID
      //   tempId: tempId,
      //   chatContactId: chatContact?._id || 'temp-chat-contact-id',
      //   sender: sellerId || 'temp-seller-id',
      //   senderOnModel: 'Seller' as 'Seller',
      //   content: {
      //     text: newMessage as string,
      //     media: [],
      //   },
      //   type: 'text' as EMessageType.TEXT,
      //   timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      //   status: 'pending' as EMessageStatus.PENDING,
      //   replyTo: null,
      // };
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

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await Clipboard.setString(text);
      showToast('success', `${type} ID copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      showToast('error', `Failed to copy ${type} ID.`);
    }
  };

  const renderReplyToContent = (replyTo: any) => {
    if (!replyTo) {
      return null;
    }

    if (replyTo.onModel === 'Message') {
      const replyToMessage = replyTo as ReplyToMessage;
      // Check if the replied message contains media
      const isMedia = replyToMessage.content?.media?.[0];
      const mediaType = isMedia?.type;
      const mediaUrl = isMedia?.url;

      if (mediaType === 'image' && mediaUrl) {
        return (
          <View style={styles.replyContentContainerImage}>
            <Image
              source={{uri: mediaUrl}}
              style={styles.replyThumbnail}
              resizeMode="cover"
            />
            <Text style={styles.replyText} numberOfLines={1}>
              {replyToMessage.content?.text || 'Image'}
            </Text>
          </View>
        );
      } else if (mediaType === 'audio') {
        return (
          <View style={styles.replyContentContainerText}>
            <Icon name="sound" size={20} color="#fff" />
            <Text style={styles.replyText} numberOfLines={1}>
              {replyToMessage.content?.text || 'Voice Message'}
            </Text>
          </View>
        );
      } else {
        return (
          <View style={styles.replyTextWrapper}>
            <Text style={styles.replyContent} numberOfLines={4}>
              {replyToMessage.content?.text || 'Message'}
            </Text>
          </View>
        );
      }
    }

    if (replyTo.onModel === 'Order') {
      const replyToOrder = replyTo as ReplyToOrder;
      return (
        <View style={styles.replyContentContainerText}>
          <Text style={styles.replyText}>Order: {replyToOrder.orderId}</Text>
          <TouchableOpacity
            onPress={() =>
              handleCopyToClipboard(replyToOrder.orderId!, 'Order')
            }>
            <Icon name="copy1" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    if (replyTo.onModel === 'Product') {
      const replyToProduct = replyTo as ReplyToProduct;
      return (
        <View style={styles.replyContentContainerText}>
          <Text style={styles.replyText}>
            Product: {replyToProduct.productId}
          </Text>
          <TouchableOpacity
            onPress={() =>
              handleCopyToClipboard(replyToProduct.productId!, 'Product')
            }>
            <Icon name="copy1" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderItem = ({item, index}: {item: ChatItem; index: number}) => {
    if (item.type === 'date_separator') {
      const dateSeparator = item as IDateSeparator;
      const formattedDate = dateSeparator.date.format('dddd, MMMM D, YYYY');
      return (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>{formattedDate}</Text>
        </View>
      );
    }

    const message = item as IMessage;
    const isSender = message.senderOnModel === 'Seller';

    return (
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
          {message.replyTo && (
            <View style={styles.replyContainer}>
              {renderReplyToContent(message.replyTo)}
            </View>
          )}

          {message.content.media?.length! > 0 && (
            <>
              {message.content.media![0].type === 'image' ? (
                <TouchableOpacity
                  onPress={() => {
                    setPreviewImage({
                      uri: message.content.media?.[0].url as string,
                    });
                    setIsChatImagePreviewVisible(true);
                    setCaption(message.content.text || '');
                  }}>
                  <Image
                    source={{uri: message.content.media![0].url}}
                    style={styles.messageImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : message.content.media![0].type === 'audio' ? (
                <TouchableOpacity
                  disabled={loadingAudio}
                  onPress={() => {
                    // You can add playback logic here
                    console.log('Play audio:', message.content.media?.[0].url);
                    // togglePlayback(message.content.media!?.[0].url, index);
                  }}
                  style={styles.audioMessageContainer}>
                  {loadingAudio && currentPlayingIndex === index ? (
                    <ActivityIndicator
                      size="small"
                      color={Theme.colors.primary}
                    />
                  ) : (
                    <Icon
                      name={
                        currentPlayingIndex === index && isPlaying
                          ? 'pause'
                          : 'play'
                      }
                      size={20}
                      color={Theme.colors.primary}
                    />
                  )}
                  <Text style={styles.audioText}>Voice message</Text>
                </TouchableOpacity>
              ) : null}
            </>
          )}
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
  };

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
    if (newMessage as string) {
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

  const handlePickImage = () => {
    ImagePicker.openPicker({
      cropping: false,
      compressImageQuality: 0.8, // Compression quality (0 to 1)
      mediaType: 'photo',
      multiple: false, // Single image selection
    })
      .then(image => {
        setNewMessage({
          url: image.path,
          fileName: image.path.split('/').pop(),
          type: image.mime,
          size: image.size,
        });
        setIsPreviewVisible(true); // Show the preview modal
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('User cancelled image picker');
        } else {
          Alert.alert('Image Error', error.message || 'Unknown error');
        }
      });
  };

  const handleClickImage = () => {
    ImagePicker.openCamera({
      cropping: false,
      compressImageQuality: 0.8, // Compression quality (0 to 1)
      mediaType: 'photo',
      multiple: false, // Single image selection
    })
      .then(image => {
        setNewMessage({
          url: image.path,
          fileName: image.path.split('/').pop(),
          type: image.mime,
          size: image.size,
        });
        setIsPreviewVisible(true); // Show the preview modal
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('User cancelled image picker');
        } else {
          Alert.alert('Image Error', error.message || 'Unknown error');
        }
      });
  };

  const handleSendMedia = async (newMessage: IMedia) => {
    console.log('handleSendMedia called with:', newMessage);
    if (newMessage && (newMessage as IMedia).url) {
      const tempId = generateUniqueId();
      const mediaMessage: IMessage = {
        _id: `temp-${Date.now()}`, // Temporary ID
        tempId: tempId,
        chatContactId: chatContact?._id || 'temp-chat-contact-id',
        sender: buyerId || 'temp-buyer-id',
        senderOnModel: 'Buyer' as 'Buyer',
        content: {
          text: newMessage.caption || '',
          media: [
            {
              ...newMessage,
              type: newMessage.type?.startsWith('image')
                ? 'image'
                : newMessage.type?.startsWith('audio')
                ? 'audio'
                : 'file',
            },
          ],
        },
        type: 'text' as EMessageType.TEXT,
        timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        status: 'pending' as EMessageStatus.PENDING,
        replyTo: null,
      };
      console.log('sadfasdg', mediaMessage.content.media?.[0].url as string);
      // handlePendingChatMsg(mediaMessage, setMessages);
      setIsPreviewVisible(false);
      setCaption('');
      setPreviewImage(null);
      setIsVoiceChatActive(false);
      const {status, message, data} = await sendMediaForUploadingForChat(
        newMessage as IMedia,
        (shop.sellerId as TSeller)._id!,
        socketId as string,
        tempId,
      );
      if (status) {
        dispatch(
          updateLastMessage({
            chatContactId: chatContact?._id || '',
            message: data.chatMessage,
          }),
        );
        // handleContinuousChat(data.chatMessage, setMessages);
        // applyServerAck(data.chatMessage, setMessages);
        setIsPreviewVisible(false);
        setCaption('');
        setPreviewImage(null);
      }
    }
  };

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
          <Text style={styles.userName}>{shop.shopName}</Text>
          <Text style={styles.statusText}>
            {isTyping ? 'typing...' : isUserOnline ? 'online' : 'offline'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <MaterialIcon
            onPress={() =>
              Linking.openURL(
                `tel:${
                  (shop.sellerId as TSeller).mobile.startsWith('+91')
                    ? (shop.sellerId as TSeller).mobile
                    : `+91 ${(shop.sellerId as TSeller).mobile}`
                }`,
              )
            }
            name="call"
            size={24}
            color="white"
            style={styles.iconSpacing}
          />
        </View>
      </View>

      <FlatList
        data={addDateSeparators(messages)}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.listContent}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color="#fff" /> : null
        }
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.plusButton}>
          <Icon name="pluscircleo" size={24} color="#667781" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClickImage}
          style={styles.cameraButton}>
          <MaterialIcon name="camera-alt" size={24} color="#667781" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage as string}
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

      <ImagePreviewModal
        isPreviewVisible={isPreviewVisible}
        setIsPreviewVisible={setIsPreviewVisible}
        setNewMessage={
          setNewMessage as React.Dispatch<React.SetStateAction<IMedia>>
        }
        newMessage={newMessage as IMedia}
        handleSendImage={handleSendMedia}
      />

      <ChatImagePreviewModal
        caption={caption}
        setCaption={setCaption}
        isChatImagePreviewVisible={isChatImagePreviewVisible}
        setIsChatImagePreviewVisible={setIsChatImagePreviewVisible}
        previewImage={previewImage}
      />
    </KeyboardAvoidingView>
  );
};

export default PersonalChatScreen;

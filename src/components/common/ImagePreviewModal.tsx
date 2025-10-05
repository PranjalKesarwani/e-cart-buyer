import {
  View,
  Text,
  Modal,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAvoidingView} from 'react-native';
import {IMedia} from '../../types';

type TImagePreviewProp = {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;

  setNewMessage: React.Dispatch<React.SetStateAction<IMedia>>;
  newMessage: IMedia;
  handleSendImage: (newMessage: IMedia) => void;
};

const ImagePreviewModal = ({
  isPreviewVisible,
  setIsPreviewVisible,
  setNewMessage,
  newMessage,
  handleSendImage,
}: TImagePreviewProp) => {
  return (
    <Modal
      visible={isPreviewVisible}
      animationType="slide"
      onRequestClose={() => setIsPreviewVisible(false)}>
      <View style={styles.previewContainer}>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        {/* Header */}
        <SafeAreaView style={styles.previewHeader}>
          <View style={styles.previewHeaderContent}>
            <TouchableOpacity
              onPress={() => setIsPreviewVisible(false)}
              style={styles.previewBackButton}>
              <Icon name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {newMessage && (
            <Image
              source={{uri: newMessage.url}}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Caption Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.bottomContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="#8696A0"
              value={newMessage?.caption}
              onChangeText={(text: string) =>
                setNewMessage(
                  (prev: IMedia): IMedia => ({...prev, caption: text}),
                )
              }
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              onPress={() => handleSendImage(newMessage)}
              style={styles.sendButton}>
              <MaterialIcon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewHeader: {
    backgroundColor: 'black',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222D34',
  },
  previewHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  previewBackButton: {
    padding: 8,
  },
  previewTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  previewSendButton: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: 'black',
    borderTopWidth: 0.5,
    borderTopColor: '#222D34',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2A3942',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  captionInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#00A884',
    alignSelf: 'center',
  },
});

export default ImagePreviewModal;

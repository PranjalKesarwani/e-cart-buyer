import {
  View,
  Text,
  Modal,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingView} from 'react-native';
import {Theme} from '../../theme/theme';

type TImagePreviewProp = {
  isChatImagePreviewVisible: boolean;
  setIsChatImagePreviewVisible: (visible: boolean) => void;
  previewImage: {uri: string} | null;
  caption: string;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
};

const ChatImagePreviewModal = ({
  isChatImagePreviewVisible,
  setIsChatImagePreviewVisible,
  previewImage,
  caption,
  setCaption,
}: TImagePreviewProp) => {
  return (
    <Modal
      visible={isChatImagePreviewVisible}
      animationType="slide"
      onRequestClose={() => setIsChatImagePreviewVisible(false)}>
      <View style={styles.previewContainer}>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        {/* Header */}
        <SafeAreaView style={styles.previewHeader}>
          <View style={styles.previewHeaderContent}>
            <TouchableOpacity
              onPress={() => {
                setCaption('');
                setIsChatImagePreviewVisible(false);
              }}
              style={styles.previewBackButton}>
              <Icon name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {previewImage && (
            <Image
              source={{uri: previewImage.uri}}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Caption Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.captionContainer]}>
          <View>
            <Text style={{color: 'white', textAlign: 'center', fontSize: 17}}>
              {caption}
            </Text>
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
  captionContainer: {
    padding: 16,
    backgroundColor: 'black',
    borderTopWidth: 0.5,
    borderTopColor: '#222D34',
  },
  captionInput: {
    backgroundColor: '#2A3942',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
  },
});

export default ChatImagePreviewModal;

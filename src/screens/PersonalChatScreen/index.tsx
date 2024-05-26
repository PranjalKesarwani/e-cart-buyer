import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/AntDesign'; // Import Ant Design icons

type PersonalChatScreenProps = NativeStackScreenProps<RootStackParamList, 'PersonalChatScreen'>;

const PersonalChatScreen = ({ navigation, route }: PersonalChatScreenProps) => {
  const [messages, setMessages] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i.toString(),
      text: `Message ${i + 1}`,
      sender: i % 2 === 0 ? 'user' : 'other',
    }))
  );
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = { id: Date.now().toString(), text: newMessage, sender: 'user' };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }: { item: { id: string, text: string, sender: string } }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.userName}>Pranjal</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PersonalChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
  },
});

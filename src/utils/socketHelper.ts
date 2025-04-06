import React from 'react';
import {IMessage, TChatContact} from '../types';

export const handleCreatedChat = (
  data: TChatContact,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>,
  setChatContact: React.Dispatch<React.SetStateAction<TChatContact | null>>,
) => {
  // Update the messages state with the new message received from the server
  if (data?.lastMessage && typeof data.lastMessage === 'object') {
    setMessages(prevMessages => [
      ...prevMessages,
      data.lastMessage as IMessage,
    ]);
    setChatContact(data);
    // setNewMessage('');
  } else {
    console.warn('Invalid lastMessage received:', data.lastMessage);
  }
};

export const handleContinuousChat = (
  data: IMessage,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>,
) => {
  console.log('continuous data checking', data);
  setMessages(prevMessages => [data, ...prevMessages]);
};

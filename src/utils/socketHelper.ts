import React from 'react';
import {EMessageStatus, IMessage, TChatContact} from '../types';

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
  setMessages(prevMessages => {
    const isDuplicate = prevMessages.some(
      msg => msg._id === data._id || msg.timestamp === data.timestamp,
    );
    if (isDuplicate) return prevMessages;
    return [data, ...prevMessages]; // or [data, ...prevMessages] if latest at top
  });
};

export const handlePendingChatMsg = (
  data: IMessage,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>,
) => {
  setMessages(prevMessages => {
    const isDuplicate = prevMessages.some(
      msg =>
        // prefer tempId comparison if available
        (data.tempId && msg.tempId && msg.tempId === data.tempId) ||
        msg._id === data._id ||
        msg.timestamp === data.timestamp,
    );
    if (isDuplicate) return prevMessages;
    return [data, ...prevMessages];
  });
};

export const applyServerAck = (
  serverMsg: IMessage,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>,
) => {
  setMessages(prev => {
    // 1) If the server message _id already exists in state, ignore (dedupe)
    const alreadyHas = prev.some(m => m._id === serverMsg._id);
    if (alreadyHas) return prev;

    // 2) Try to find matching pending message by tempId (best)
    if (serverMsg.tempId) {
      let found = false;
      const updated = prev.map(m => {
        if (m.tempId && m.tempId === serverMsg.tempId) {
          found = true;
          // replace the pending message with the server message
          return {...serverMsg, status: EMessageStatus.SENT}; // or serverMsg.status
        }
        return m;
      });

      if (found) return updated;
    }
    return [serverMsg, ...prev];
  });
};

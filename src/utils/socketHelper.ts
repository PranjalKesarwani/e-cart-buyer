import {IMessage, TChatContact} from '../types';

export const handleCreatedChat = (
  data: TChatContact,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>,
) => {
  // Update the messages state with the new message received from the server
  if (data?.lastMessage && typeof data.lastMessage === 'object') {
    setMessages(prevMessages => [
      ...prevMessages,
      data.lastMessage as IMessage,
    ]);
  } else {
    console.warn('Invalid lastMessage received:', data.lastMessage);
  }
};

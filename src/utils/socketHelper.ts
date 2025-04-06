import {TChatContact} from '../types';

export const handleCreatedChat = (
  data: TChatContact,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  console.log('-------------->>>>', data);
  // Update the messages state with the new message received from the server
  //   setMessages(prevMessages => [...prevMessages, data.lastMessage]);
};

// src/features/user/sellerSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IMessage, StatusUpdateType, TChatContact} from '../../types';

type TInitialStateChatSlice = {
  chatContacts: TChatContact[];
  socketId: string | null;
  unseenStatusUpdates: StatusUpdateType[];
  seenStatusUpdates: StatusUpdateType[];
};
const initialState: TInitialStateChatSlice = {
  chatContacts: [],
  socketId: null,
  unseenStatusUpdates: [],
  seenStatusUpdates: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatContacts(state, action: PayloadAction<TChatContact[]>) {
      state.chatContacts = action.payload;
    },
    updateLastMessage(
      state,
      action: PayloadAction<{chatContactId: string; message: IMessage}>,
    ) {
      const {chatContactId, message} = action.payload;

      const chatIndex = state.chatContacts.findIndex(
        c => c._id === chatContactId,
      );

      if (chatIndex !== -1) {
        state.chatContacts[chatIndex] = {
          ...state.chatContacts[chatIndex],
          lastMessage: message,
          updatedAt: new Date(), // keep list fresh
        };

        // Optional: move updated chat to the top of list (like WhatsApp)
        const updatedContact = state.chatContacts.splice(chatIndex, 1)[0];
        state.chatContacts.unshift(updatedContact);
      }
    },
    setSocketId(state, action: PayloadAction<string>) {
      state.socketId = action.payload;
    },
    setUnseenStatusUpdates(state, action: PayloadAction<StatusUpdateType[]>) {
      state.unseenStatusUpdates = action.payload;
    },
    setSeenStatusUpdates(state, action: PayloadAction<StatusUpdateType[]>) {
      state.seenStatusUpdates = action.payload;
    },
    // removeStatusUpdate(state, action: PayloadAction<string>) {
    //   state.statusUpdates = state.statusUpdates.filter(
    //     status => status._id !== action.payload,
    //   );
    // },
    // addStatusUpdates(state, action: PayloadAction<StatusUpdateType[]>) {
    //   state.statusUpdates = [...action.payload, ...state.statusUpdates];
    // },
  },
  extraReducers: builder => {},
});

export const {
  setChatContacts,
  setSeenStatusUpdates,
  setUnseenStatusUpdates,
  updateLastMessage,
  setSocketId,
} = chatSlice.actions;

export default chatSlice.reducer;

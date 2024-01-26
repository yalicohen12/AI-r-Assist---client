import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface ConversationState {
  conversationID: string;
  fetchedMessages: boolean;
}

const initialState: ConversationState = {
  conversationID: localStorage.getItem('conversationID') || '',
  fetchedMessages: false,
};

const conversationSlice = createSlice({
  name: "conversationSliceState",
  initialState: initialState,
  reducers: {
    set(state, action: PayloadAction<string>) {
      state.conversationID = action.payload;
      state.fetchedMessages = false;
      localStorage.setItem("conversationID", action.payload);
    },
    newConversation(state) {
      state.fetchedMessages = true;
      state.conversationID = "";
      localStorage.setItem("conversationID", "");
    },
  },
});

export default conversationSlice;
export const { set, newConversation } = conversationSlice.actions;

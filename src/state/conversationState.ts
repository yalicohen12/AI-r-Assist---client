import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface ConversationState {
  conversationID: string;
  fetchedMessages: boolean;
  conversationName?: string;
}

const initialState: ConversationState = {
  conversationID: localStorage.getItem("conversationID") || "",
  fetchedMessages: false,
  conversationName: "",
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
    onFirstMsg(state, action: PayloadAction<string>) {
      state.conversationID = action.payload;
      localStorage.setItem("conversationID", action.payload);
      state.fetchedMessages = true;
    },
    newConversation(state) {
      state.fetchedMessages = true;
      state.conversationID = "";
      localStorage.setItem("conversationID", "");
    },
    setConversationName(state, action: PayloadAction<string>) {
      state.conversationName = action.payload;
    },
  },
});

export default conversationSlice;
export const { set, newConversation, onFirstMsg, setConversationName } =
  conversationSlice.actions;

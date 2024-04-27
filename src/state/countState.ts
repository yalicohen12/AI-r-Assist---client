import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface ModelState {
  filesCount: number;
  conversationCount: number;
}

const initialState: ModelState = {
  filesCount: 0,
  conversationCount: 0,
};

const countSlice = createSlice({
  name: "countSlice",
  initialState: initialState,
  reducers: {
    updatefilesCount(state, action: PayloadAction<any>) {
      state.filesCount = action.payload;
    },
    updateConversationCount(state, action: PayloadAction<any>) {
      state.conversationCount = action.payload;
    },
  },
});

export default countSlice;
export const { updateConversationCount, updatefilesCount } = countSlice.actions;

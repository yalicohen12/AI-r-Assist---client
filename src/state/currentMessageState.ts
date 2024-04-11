import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface currentMessageState {
  messageID: string;
}

const initialState: currentMessageState = {
  messageID: "None",
};

const currentMessageSlice = createSlice({
  name: "currentMessageSlice",
  initialState: initialState,
  reducers: {
    setMessageID(state, action: PayloadAction<any>) {
      state.messageID = action.payload;
    },
  },
});

export default currentMessageSlice;
export const {setMessageID} = currentMessageSlice.actions;

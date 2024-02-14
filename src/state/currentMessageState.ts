import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface currentMessageState {
  messageID: number;
}

const initialState: currentMessageState = {
  messageID: 0,
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

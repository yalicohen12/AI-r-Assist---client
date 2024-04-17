import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface StreamingState {
  isStreaming: boolean;
}

const initialState: StreamingState = {
  isStreaming: false,
};

const streamingSlice = createSlice({
  name: "streamingSlice",
  initialState: initialState,
  reducers: {
    turnStreamOn(state) {
      state.isStreaming = true;
    },
    turnStreamOff(state) {
      state.isStreaming = false;
    },
  },
});

export default streamingSlice;
export const { turnStreamOn, turnStreamOff } = streamingSlice.actions;

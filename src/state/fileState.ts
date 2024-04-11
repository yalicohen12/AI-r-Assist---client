import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface FileState {
  fileName: string|null

}
const initialState: FileState = {
  fileName: null
};

const fileSlice = createSlice({
  name: "fileSlice",
  initialState: initialState,
  reducers: {
    setFile(state, action: PayloadAction<string>) {
      state.fileName = action.payload;
    },
    clearFile(state) {
      state.fileName = null
    },
  },
});

export default fileSlice;
export const { setFile, clearFile } = fileSlice.actions;

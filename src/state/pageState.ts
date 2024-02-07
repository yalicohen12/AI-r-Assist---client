import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface PageState {
  page: string;
}

const initialState: PageState = {
  page: "Chat",
};

const pageSlice = createSlice({
  name: "pageSlice",
  initialState: initialState,
  reducers: {
    setPage(state, action: PayloadAction<string>) {
      state.page = action.payload;
    },
  },
});

export default pageSlice;
export const { setPage } = pageSlice.actions;

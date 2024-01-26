import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface AuthStatus {
  isAuth: boolean;
}

const initialState: AuthStatus = {
  isAuth: localStorage.getItem("userID") ? true : false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {
    connect(state) {
      state.isAuth = true;
    },
    disConnect(state) {
      state.isAuth = false;
    },
  },
});

export default authSlice;
export const { connect, disConnect } = authSlice.actions;

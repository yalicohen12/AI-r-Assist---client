import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface ModelState {
    model:string
}

const initialState: ModelState = {
    model:"offline"
};

const modelSlice = createSlice({
  name: "modelSliceState",
  initialState: initialState,
  reducers: {
    turnOffline(state) {
        state.model = "offline"
    },
    turnOnline(state) {
        state.model = "online"
    },
 
  },
});

export default modelSlice;
export const {turnOffline, turnOnline} = modelSlice.actions;

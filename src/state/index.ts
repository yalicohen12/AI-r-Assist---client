import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./conversationState";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import authSlice from "./authStatusState";
import pageSlice from "./pageState";

const store = configureStore({
  reducer: {
    conversationSlice: conversationSlice.reducer,
    authSlice: authSlice.reducer,
    pageSlice: pageSlice.reducer,

  },
});

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => typeof store.dispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

export default store;

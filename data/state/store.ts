import { configureStore } from "@reduxjs/toolkit";
import friendsReducer from "./friendsSlice";
import messagesReducer from "./messagesSlice";

export const store = configureStore({
  reducer: {
    friends: friendsReducer,
    messages: messagesReducer,
  }
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;


import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { Event } from "../websocket/Event";
import { RootState } from "./store";

export type MessagesState = {
  messages: MessageType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export type MessageType = {
  id: number
  content: string;
  friendname: string;
  role: "sender" | "recipient";
  time: Date;
  opened: boolean;
}

const initialState: MessagesState = {
  messages: [],
  status: "idle",
  error: null,
}
  
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async () => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/messages", {
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const content = await response.json();
  return content.messages;
});

export const sendMessage = createAsyncThunk("messages/sendMessage", async (data: {conn: WebSocket, friendname: string, content: string, time: Date}) => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/messages", {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      "friendname": data.friendname,
      "content": data.content,
      "time": data.time,
    }),
  });
  const content = await response.json();
  const payload = {
    id: content.message.id,
    message: content.message.content,
    recipient: content.message.friendname,
    time: content.message.time,
  }
  const event: Event = { type: "send_message", payload };
  data.conn.send(JSON.stringify(event));
  return content.message;
});

export const openMessage = createAsyncThunk("messages/openMessage", async (data: {conn: WebSocket, username: string, friendname: string}) => {
  const payload = {
    recipient: data.username,
    sender: data.friendname,
  }
  const event: Event = { type: "open_message", payload };
  data.conn.send(JSON.stringify(event));

  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/messages/" + data.friendname, {
    "method": "PUT",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  await response.json();
  return data.friendname;
});

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<MessageType>) => {
      state.messages.push(action.payload)
    },
    openedByFriend: (state, action: PayloadAction<string>) => {
      const messages = state.messages.map(message => message.friendname === action.payload && message.role === "sender"
                                                      ? ({...message, opened: true})
                                                      : message);
      state.messages = messages;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = "failed";
        state.error = "Error loading messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(openMessage.fulfilled, (state, action) => {
        const messages = state.messages.map(message => message.friendname === action.payload && message.role === "recipient"
                                                        ? ({...message, opened: true})
                                                        : message)
        state.messages = messages;
      })
  }

});

export const selectAllMessages = (state: RootState) => state.messages.messages;
export const selectMessagesWithFriend = createSelector(
  [
    selectAllMessages,
    (state: RootState, friendname: string) => friendname
  ],
  (messages, friendname) => messages.filter(message => message.friendname === friendname)
                                    .sort((m1, m2) => m1.time < m2.time ? -1 : 1)
);
export const selectHasUnopenedMessages = createSelector(
  [selectMessagesWithFriend],
  messages => messages.filter(message => message.role === "recipient")
                      .some(message => !message.opened)
);

export const { receiveMessage, openedByFriend } = messagesSlice.actions;

export default messagesSlice.reducer;
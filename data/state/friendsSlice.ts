import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { Event } from "../websocket/Event";
import { RootState } from "./store";
import { selectAllMessages } from "./messagesSlice";

export type FriendsState = {
  friends: FriendType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

type FriendType = {
  username: string;
  imageUrl: string;
  status: "friend" | "sent request" | "received request" | "none";
}

const initialState: FriendsState = {
  friends: [],
  status: "idle",
  error: null,
}

export const fetchFriends = createAsyncThunk("friends/fetchFriends", async () => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends", {
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const content = await response.json();
  console.log("friends: ", content.friends.friends);
  return content.friends.friends;
});

export const sendRequest = createAsyncThunk("friends/sendRequest", async (data: {conn: WebSocket, username: string, recipient: string}) => {
  const payload = {
    eventSender: data.username,
    eventRecipient: data.recipient,
  }
  const event: Event = { type: "send_request", payload };
  data.conn.send(JSON.stringify(event));

  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends", {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    "body": JSON.stringify({ recipient: data.recipient })
  });
  await response.json();
  return data.recipient;
});

export const acceptRequest = createAsyncThunk("friends/acceptRequest", async (data: {conn: WebSocket, username: string, sender: string}) => {
  const payload = {
    eventSender: data.username,
    eventRecipient: data.sender,
  }
  const event: Event = { type: "accept_request", payload };
  data.conn.send(JSON.stringify(event));

  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends/" + data.sender, {
    "method": "PUT",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  await response.json();
  return data.sender;
});

export const removeFriend = createAsyncThunk("friends/removeFriend", async (data: {conn: WebSocket, username: string, friendname: string}) => {
  console.log("removing friend");
  const payload = {
    eventSender: data.username,
    eventRecipient: data.friendname,
  }
  const event: Event = { type: "remove_friend", payload };
  data.conn.send(JSON.stringify(event));

  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends/" + data.friendname, {
    "method": "DELETE",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  await response.json();
  return data.friendname;
});

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    receiveRequest: (state, action: PayloadAction<string>) => {
      const friend = state.friends.find(friend => friend.username === action.payload);
      if (friend) {
        friend.status = "received request";
      }
    },
    addFriend: (state, action: PayloadAction<string>) => {
      const friend = state.friends.find(friend => friend.username === action.payload);
      if (friend) {
        friend.status = "friend";
      }
    },
    removedByFriend: (state, action: PayloadAction<string>) => {
      const friend = state.friends.find(friend => friend.username === action.payload);
      if (friend) {
        friend.status = "none";
      }
    },
    resetFriends: (state) => {
      state.status = "idle";
      state.friends = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state) => {
        state.status = "failed";
        state.error = "Error loading friends";
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        const friend = state.friends.find(friend => friend.username === action.payload);
        if (friend) {
          friend.status = "sent request";
        }
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const friend = state.friends.find(friend => friend.username === action.payload);
        if (friend) {
          friend.status = "friend";
        }
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        const friend = state.friends.find(friend => friend.username === action.payload);
        if (friend) {
          friend.status = "none";
        }
      })
  }
});

export const selectAllFriends = (state: RootState) => state.friends.friends;

export const selectFriend = createSelector(
  [selectAllFriends, selectAllMessages],
  (friends, messages) => 
    friends.filter(friend => friend.status === "friend")
           .map(friend => ({
                  username: friend.username,
                  mostRecentMessage: messages.filter(message => message.friendname === friend.username)
                                            .sort((m1, m2) => m1.time > m2.time ? -1 : 1)[0],
                  unopenedCount: messages.filter(message => message.friendname === friend.username
                                                            && message.role === "recipient"
                                                            && !message.opened)
                                          .length
                }))
);
export const selectSentRequest = createSelector(
  [selectAllFriends],
  (friends) => friends.filter(friend => friend.status === "sent request")
);
export const selectReceivedRequest = createSelector(
  [selectAllFriends],
  (friends) => friends.filter(friend => friend.status === "received request")
);
export const selectNoStatus = createSelector(
  [selectAllFriends],
  (friends) => friends.filter(friend => friend.status === "none")
);
export const selectFriendsStatus = (state: RootState) => state.friends.status;

export const { receiveRequest, addFriend, removedByFriend, resetFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
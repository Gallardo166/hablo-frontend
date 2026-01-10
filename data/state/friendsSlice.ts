import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { RootState } from "./store";

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

export const sendRequest = createAsyncThunk("friends/sendRequest", async (recipient: string) => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends", {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    "body": JSON.stringify({ recipient })
  });
  await response.json();
  return recipient;
});

export const acceptRequest = createAsyncThunk("friends/acceptRequest", async (sender: string) => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends/" + sender, {
    "method": "PUT",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  await response.json();
  return sender;
});

export const removeFriend = createAsyncThunk("friends/removeFriend", async (username: string) => {
  const token = await SecureStore.getItemAsync("token");
  const response = await fetch("http://localhost:8080/v1/friends/" + username, {
    "method": "DELETE",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  await response.json();
  return username;
})

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
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
  [selectAllFriends],
  (friends) => friends.filter(friend => friend.status === "friend")
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

export const { resetFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
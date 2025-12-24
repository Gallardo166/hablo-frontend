import { FriendType, SocialContext } from '@/components/welcome/sign-up/SocialContext';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';

const SocialLayout = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [friends, setFriends] = useState<FriendType[]>([]);

  async function getFriends() {
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
    console.log(content.friends);
    if (!content.error) {
      setLoading(false);
      setFriends(content.friends.friends);
    }
  }

  useEffect(() => {
    getFriends();
  }, []);

  async function handleSendRequest(recipient: string) {
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
    const content = await response.json();
    console.log(content);
    if (!content.error) {
      setFriends(friends.map(friend => 
        friend.username === recipient
          ? {...friend, status: "sent request"}
          : friend
      ))
    }
  }

  async function handleRemove(username: string) {
    const token = await SecureStore.getItemAsync("token");
    const response = await fetch("http://localhost:8080/v1/friends/" + username, {
      "method": "DELETE",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const content = await response.json();
    console.log(content);
    if (!content.error) {
      setFriends(friends.map(friend => 
        friend.username === username
          ? {...friend, status: "none"}
          : friend
      ))
    }
  }

  async function handleAcceptRequest(sender: string) {
    const token = await SecureStore.getItemAsync("token");
    const response = await fetch("http://localhost:8080/v1/friends/" + sender, {
      "method": "PUT",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const content = await response.json();
    console.log(content);
    if (!content.error) {
      setFriends(friends.map(friend =>
        friend.username === sender
          ? {...friend, status: "friend"}
          : friend
      ))
    }
  }

  return (
    <SocialContext value={ {loading, friends, handleSendRequest, handleRemove, handleAcceptRequest } }>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Explore"
          }}
        />
        <Tabs.Screen
          name="requests"
          options={{
            title: "Requests"
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: "Friends"
          }}
        />
      </Tabs>
    </SocialContext>
  )
}

export default SocialLayout
import { fetchFriends, selectFriendsStatus } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TabsLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friendsStatus = useSelector(selectFriendsStatus);

  useEffect(() => {
    if (friendsStatus === "idle") {
      dispatch(fetchFriends());
    }
  }, [friendsStatus, dispatch]);

  return (
    <Tabs initialRouteName="index" screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name="social"
        options={{
          title: "Social"
        }}
        
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile"
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
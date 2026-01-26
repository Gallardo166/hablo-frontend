import { PrimaryText, SecondaryText } from '@/components/Styled';
import { fetchFriends, selectFriendsStatus } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, useColorScheme } from 'react-native';
import { colors } from 'react-native-keyboard-controller/lib/typescript/components/KeyboardToolbar/colors';
import { useDispatch, useSelector } from 'react-redux';

const TabsLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friendsStatus = useSelector(selectFriendsStatus);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (friendsStatus === "idle") {
      dispatch(fetchFriends());
    }
  }, [friendsStatus, dispatch]);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{headerShown: false, tabBarStyle: {height: 84, backgroundColor: colorScheme === "light" ? "#D4D4D8" : "#27272A", borderTopColor: "#71717B"}}}>
      <Tabs.Screen
        name="social"
        options={{
          tabBarIcon: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/social-active-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/social-active-dark.png")} />
            : colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/social-inactive-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/social-inactive-dark.png")} />
          },
          tabBarLabel: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Text className="font-itim text-zinc-600 mt-2 ml-0.5">Social</Text>
              : <Text className="font-itim text-zinc-100 mt-2 ml-0.5">Social</Text>
            : colorScheme === "light"
              ? <Text className="font-itim text-zinc-400 mt-2 ml-0.5">Social</Text>
              : <Text className="font-itim text-zinc-500 mt-2 ml-0.5">Social</Text>
          },
          title: "Social"
        }}
        
        
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/chats-active-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/chats-active-dark.png")} />
            : colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/chats-inactive-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/chats-inactive-dark.png")} />
          },
          tabBarLabel: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Text className="font-itim text-zinc-600 mt-2 ml-0.5">Chats</Text>
              : <Text className="font-itim text-zinc-100 mt-2 ml-0.5">Chats</Text>
            : colorScheme === "light"
              ? <Text className="font-itim text-zinc-400 mt-2 ml-0.5">Chats</Text>
              : <Text className="font-itim text-zinc-500 mt-2 ml-0.5">Chats</Text>
          },
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/profile-active-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/profile-active-dark.png")} />
            : colorScheme === "light"
              ? <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/profile-inactive-light.png")} />
              : <Image className="mt-2 w-8 h-8" source={require("../../assets/icons/profile-inactive-dark.png")} />
          },
          tabBarLabel: ({focused}: {focused: boolean}) => {
            return focused
            ? colorScheme === "light"
              ? <Text className="font-itim text-zinc-600 mt-2">Profile</Text>
              : <Text className="font-itim text-zinc-100 mt-2">Profile</Text>
            : colorScheme === "light"
              ? <Text className="font-itim text-zinc-400 mt-2">Profile</Text>
              : <Text className="font-itim text-zinc-500 mt-2">Profile</Text>
          },
          title: "My Profile"
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
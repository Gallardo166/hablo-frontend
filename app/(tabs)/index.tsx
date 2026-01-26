import { useAppContext } from '@/components/context/AppContext';
import { PrimaryText, SecondaryText, StyledInput, StyledView } from '@/components/Styled';
import { selectFriend } from '@/data/state/friendsSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const Chats = () => {
  const friends = useSelector(selectFriend);
  const [query, setQuery] = useState<string>("");
  const { colorScheme } = useAppContext();

  return (
    <StyledView>
      <View className="mt-4 flex gap-6">
        <StyledInput placeholder="Search" value={query} onChangeText={(text) => setQuery(text)}></StyledInput>
        <View className={"border-b w-screen self-center " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-600")}></View>
      </View>
      {friends.length
        ? <ScrollView className="w-screen self-center mb-12" indicatorStyle={colorScheme === "light" ? "black" : "white"}>
            {friends.map(friend => (
                <View key={friend.username}>
                  <TouchableOpacity
                    className="w-screen self-center m-none pt-4 pb-4 pl-6 pr-6 flex-row gap-4"
                    onPress={() =>
                      router.navigate({
                        pathname: "/chatroom",
                        params: { friendname: friend.username }
                      }
                    )}
                  >
                    <View className="w-16 h-16 rounded-full bg-zinc-400"></View>
                    <View className="self-center grow flex gap">
                      <PrimaryText className="text-lg">{friend.username}</PrimaryText>
                      <SecondaryText className="text-lg">
                        {friend.mostRecentMessage?.content || "No messages"}
                      </SecondaryText>
                    </View>
                    {friend.unopenedCount > 0
                      ? (<View className="w-8 h-8 mt-4 rounded-full bg-violet-600 self-center flex justify-center">
                          <PrimaryText className="self-center">
                            {friend.unopenedCount}
                          </PrimaryText>
                        </View>)
                      : friend.mostRecentMessage && friend.mostRecentMessage.role === "sender"
                      ? friend.mostRecentMessage.opened
                        ? <Image resizeMode="stretch" className="self-center mt-4 w-8 h-6" source={require("../../assets/icons/read.png")}></Image>
                        : <Image resizeMode="stretch" className="self-center mt-4 w-6 h-6 mr-2" source={require("../../assets/icons/delivered.png")}></Image>
                      : null
                    }
                  </TouchableOpacity>
                  <View className={"border-b w-screen self-center " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-600")}></View>
                </View>
              ))}
          </ScrollView>
          : <View className="grow flex justify-end align-start gap-2 pl-5 mb-[64px]">
              <PrimaryText className="pl-6 text-lg">Add a friend!</PrimaryText>
              <Image resizeMode="stretch" className="w-6 h-12" source={colorScheme === "light" ? require("../../assets/icons/arrow-light.png") : require("../../assets/icons/arrow-dark.png")} />
            </View>
          }
    </StyledView>

  )
}

export default Chats
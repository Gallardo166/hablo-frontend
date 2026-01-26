import { useAppContext } from '@/components/context/AppContext';
import { useSessionContext } from '@/components/context/SessionContext';
import { PrimaryText, SecondaryText, StyledInput, StyledLink, StyledView } from '@/components/Styled';
import { openMessage, selectHasUnopenedMessages, selectMessagesPartitionedByDate, sendMessage } from '@/data/state/messagesSlice';
import { AppDispatch, RootState } from '@/data/state/store';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

const Chatroom = () => {
  const { user, conn } = useSessionContext();
  const { friendname } = useLocalSearchParams<{ friendname: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => selectMessagesPartitionedByDate(state, friendname));
  const hasUnopenedMessages = useSelector((state: RootState) => selectHasUnopenedMessages(state, friendname));
  const [ text, setText ] = useState<string>("");
  const { colorScheme } = useAppContext();

  function handleSubmitText() {
    if (conn) {
      const currentTime = new Date();
      dispatch(sendMessage({conn, friendname, content: text, time: currentTime}));
      setText("");
    }
  }

  useEffect(() => {
    if (conn && user) {
      dispatch(openMessage({conn, username: user.username, friendname}));
    }
  }, [hasUnopenedMessages, dispatch, friendname, conn, user]);

  return (
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <StyledView className="flex-1">
          <View className="flex-row mb-2">
              <StyledLink className="text-xl" text="&lt;" />
              <PrimaryText className="text-center grow text-xl mr-3">{friendname}</PrimaryText>
          </View>
          <View className={"border-b w-screen self-center " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-600")}></View>
          {messages[0].length
            ? <FlatList className="w-screen self-center mb-2"
                data={messages}
                renderItem={({item}) => (
                  <View>
                    <View className="mt-2 mb-2 flex-row self-center gap-2 w-[90vw]">
                      <View className={"self-center border-b grow " + (colorScheme === "light" ? "border-zinc-500" : "border-zinc-400")}></View>
                      <SecondaryText>{format(new Date(item[0].time), "dd MMM yyyy")}</SecondaryText>
                      <View className={"self-center border-b grow " + (colorScheme === "light" ? "border-zinc-500" : "border-zinc-400")}></View>
                    </View>
                    {item.map(message => 
                      message.role === "sender"
                      ? <View key={message.id} className="mb-3 mr-6 self-end flex-row gap-2 items-center">
                          <SecondaryText className="self-end">{format(new Date(message.time), "HH:mm")}</SecondaryText>
                          <View
                            className={"rounded-md mt-2 pl-2 pr-2 max-w-[80vw] " + (colorScheme === "light" ? "bg-violet-300" :"bg-violet-700")}
                          >
                            <View className="flex-row items-center gap-2">
                            <PrimaryText className="text-lg shrink">{message.content}</PrimaryText>
                            <Image
                              resizeMode="stretch"
                              className="w-4 h-3 mb-2 self-end"
                              source={message.opened
                                      ? colorScheme === "light"
                                        ? require("../assets/icons/small-read-light.png")
                                        : require("../assets/icons/small-read-dark.png")
                                      : colorScheme === "light"
                                        ? require("../assets/icons/small-delivered-light.png")
                                        : require("../assets/icons/small-delivered-dark.png") }/>
                            </View>
                            <Image
                              resizeMode="stretch"
                              className="w-4 h-5 absolute right-0 -bottom-2 -z-10"
                              source={colorScheme === "light" ? require("../assets/icons/arrow-tip-purple-light.png") : require("../assets/icons/arrow-tip-purple-dark.png")}
                            />
                          </View>
                        </View>
                      : <View key={message.id} className="mb-3 ml-6 self-start flex-row gap-2">
                          <View
                            className={"rounded-md mt-2 pl-2 pr-2 " + (colorScheme === "light" ? "bg-zinc-350" : "bg-zinc-600")}
                          >
                            <PrimaryText className="text-lg">{message.content}</PrimaryText>
                            <Image
                              resizeMode="stretch"
                              className="w-4 h-5 absolute left-0 -bottom-2 -z-10"
                              source={colorScheme === "light" ? require("../assets/icons/arrow-tip-grey-light.png") : require("../assets/icons/arrow-tip-grey-dark.png")}
                            />
                          </View>
                          <SecondaryText className="self-end">{format(new Date(message.time), "HH:mm")}</SecondaryText>
                        </View>)}
                  </View>)}
                inverted={true}
              />
            : <View className="grow self-center flex justify-center"><PrimaryText>No messages</PrimaryText></View>}
          <View className={"w-screen self-center flex-row p-4 gap-2 border-t " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-600")}>
            <StyledInput multiline={true} className="pt-0 text-lg flex-1 grow self-center flex" placeholder="Send message..." value={text} onChangeText={setText} />
            <TouchableOpacity className="bg-violet-600 rounded-full w-10 h-10 pl-1.5 flex justify-center items-center" onPress={handleSubmitText}>
              <Image resizeMode="stretch" className="w-5 h-5" source={require("../assets/icons/arrow.png")} />             
            </TouchableOpacity>
          </View>
        </StyledView>
      </KeyboardAvoidingView>
  )
}

export default Chatroom
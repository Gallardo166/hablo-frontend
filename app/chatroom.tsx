import { useSessionContext } from '@/components/context/SessionContext';
import { openMessage, selectHasUnopenedMessages, selectMessagesWithFriend, sendMessage } from '@/data/state/messagesSlice';
import { AppDispatch, RootState } from '@/data/state/store';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Chatroom = () => {
  const { user, conn } = useSessionContext();
  const { friendname } = useLocalSearchParams<{ friendname: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => selectMessagesWithFriend(state, friendname));
  const hasUnopenedMessages = useSelector((state: RootState) => selectHasUnopenedMessages(state, friendname));
  const [ text, setText ] = useState<string>("");

  function handleSubmitText() {
    if (conn) {
      const currentTime = new Date();
      dispatch(sendMessage({conn, friendname, content: text, time: currentTime}));
    }
  }

  useEffect(() => {
    if (conn && user) {
      dispatch(openMessage({conn, username: user.username, friendname}));
    }
  }, [hasUnopenedMessages, dispatch, friendname, conn, user]);

  return (
    <View>
      <Text>Chatroom</Text>
      <Text>{friendname}</Text>
      {messages.map(message => (
        <View key={message.id}>
          {message.role === "sender"
            ? <Text>{user?.username}: {message.content} {message.opened ? "(Read)": "(Delivered)"}</Text>
            : <Text>{friendname}: {message.content}</Text>}
        </View>
      ))}
      <TextInput placeholder="Send message..." value={text} onChangeText={setText} />
      <Button title="Send" onPress={handleSubmitText} />
    </View>
  )
}

export default Chatroom
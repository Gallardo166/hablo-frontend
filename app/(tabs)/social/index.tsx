import { useSocialContext } from '@/components/welcome/sign-up/SocialContext';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

const Explore = () => {
  const [query, setQuery] = useState<string>("");
  const { friends, handleSendRequest } = useSocialContext();

  return (
    <View>
      <TextInput placeholder="Search..." value={query} onChangeText={(text) => setQuery(text)} />
      {friends 
        ? friends.filter((friend) => friend.status === "none").map((friend) => (
          <View key={friend.username}>
            <Text>{friend.username}</Text>
            <Button title="Add" onPress={() => handleSendRequest(friend.username)} />
          </View>
        ))
        : null}
    </View>
  )
}

export default Explore;
import { selectNoStatus, sendRequest } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Explore = () => {
  const [query, setQuery] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector(selectNoStatus);

  return (
    <View>
      <TextInput placeholder="Search..." value={query} onChangeText={(text) => setQuery(text)} />
      {friends 
        ? friends.map((friend) => (
          <View key={friend.username}>
            <Text>{friend.username}</Text>
            <Button title="Add" onPress={() => dispatch(sendRequest(friend.username))} />
          </View>
        ))
        : null}
    </View>
  )
}

export default Explore;
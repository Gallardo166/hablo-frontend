import { useSessionContext } from '@/components/context/SessionContext';
import { removeFriend, selectFriend } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Friends = () => {
  const { user, conn } = useSessionContext();
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector(selectFriend);

  return (
    <View>
      {friends
        ? friends.map(friend => (
            <View key={friend.username}>
              <Text>{friend.username}</Text>
              <Button title="Remove" onPress={() => {
                if (conn && user) {
                  dispatch(removeFriend({conn, username: user.username, friendname: friend.username}));
                }
              }} />
            </View>
        ))
        : null}
    </View>
  )
}

export default Friends
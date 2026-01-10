import { acceptRequest, removeFriend, selectReceivedRequest, selectSentRequest } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Requests = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sentRequestList = useSelector(selectSentRequest);
  const receivedRequestList = useSelector(selectReceivedRequest);

  return (
    <View>
      <Text>Pending approval</Text>
      {receivedRequestList
        ? receivedRequestList.map(friend => (
            <View key={friend.username}>
              <Text>{friend.username}</Text>
              <Button title="Decline" onPress={() => dispatch(removeFriend(friend.username))} />
              <Button title="Confirm" onPress={() => dispatch(acceptRequest(friend.username))} />
            </View>
          ))
        : null}
      <Text>Sent requests</Text>
      {sentRequestList
        ? sentRequestList.map(friend => (
            <View key={friend.username}>
              <Text>{friend.username}</Text>
              <Button title="Cancel" onPress={() => dispatch(removeFriend(friend.username))} />
            </View>
          ))
        : null}
    </View>
  )
}

export default Requests
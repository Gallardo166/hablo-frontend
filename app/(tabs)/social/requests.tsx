import { useSessionContext } from '@/components/context/SessionContext';
import { acceptRequest, removeFriend, selectReceivedRequest, selectSentRequest } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Requests = () => {
  const { user, conn } = useSessionContext();
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
              <Button title="Decline" onPress={() => {
                if (conn && user) {
                  dispatch(removeFriend({conn, username: user.username, friendname: friend.username}));
                }
              }} />
              <Button title="Confirm" onPress={() => {
                if (conn && user) {
                  dispatch(acceptRequest({conn, username: user.username, sender: friend.username}));
                }
              }} />
            </View>
          ))
        : null}
      <Text>Sent requests</Text>
      {sentRequestList
        ? sentRequestList.map(friend => (
            <View key={friend.username}>
              <Text>{friend.username}</Text>
              <Button title="Cancel" onPress={() => {
                if (conn && user) {
                  dispatch(removeFriend({conn,  username: user.username, friendname: friend.username}));
                }
              }} />
            </View>
          ))
        : null}
    </View>
  )
}

export default Requests
import { useSocialContext } from '@/components/welcome/sign-up/SocialContext';
import React from 'react';
import { Button, Text, View } from 'react-native';

const Requests = () => {
  const { friends, handleRemove, handleAcceptRequest } = useSocialContext();

  return (
    <View>
      <Text>Pending approval</Text>
      {friends
        ? friends.filter(friend => friend.status === "received request")
                 .map(friend => (
                    <View key={friend.username}>
                      <Text>{friend.username}</Text>
                      <Button title="Decline" onPress={() => handleRemove(friend.username)} />
                      <Button title="Confirm" onPress={() => handleAcceptRequest(friend.username)} />
                    </View>
                 ))
        : null}
      <Text>Sent requests</Text>
      {friends
        ? friends.filter(friend => friend.status === "sent request")
                 .map(friend => (
                    <View key={friend.username}>
                      <Text>{friend.username}</Text>
                      <Button title="Cancel" onPress={() => handleRemove(friend.username)} />
                    </View>
                 ))
        : null}
    </View>
  )
}

export default Requests
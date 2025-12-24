import { useSocialContext } from '@/components/welcome/sign-up/SocialContext';
import React from 'react';
import { Button, Text, View } from 'react-native';

const Friends = () => {
  const { friends, handleRemove } = useSocialContext();

  return (
    <View>
      {friends
        ? friends.filter(friend => friend.status === "friend").map(friend => (
            <View key={friend.username}>
              <Text>{friend.username}</Text>
              <Button title="Remove" onPress={() => handleRemove(friend.username)} />
            </View>
        ))
        : null}
    </View>
  )
}

export default Friends
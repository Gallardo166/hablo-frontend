import { selectFriend } from '@/data/state/friendsSlice';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const Chats = () => {
  const friends = useSelector(selectFriend);

  return (
    <View>
      {friends
        ? friends.filter(friend => friend.status === "friend").map(friend => (
            <View key={friend.username}>
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: "/chatroom",
                    params: { friendname: friend.username }
                  }
                )}
              >
                <Text>{friend.username}</Text>
              </TouchableOpacity>
            </View>
          ))
        : null}
    </View>

  )
}

export default Chats
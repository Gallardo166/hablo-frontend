import { Tabs } from 'expo-router';
import React from 'react';

const SocialLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore"
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests"
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends"
        }}
      />
    </Tabs>
  )
}

export default SocialLayout
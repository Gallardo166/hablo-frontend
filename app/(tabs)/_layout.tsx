import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen
        name="social"
        options={{
          title: "Social"
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile"
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
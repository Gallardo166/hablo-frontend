import { Stack } from 'expo-router';
import React from 'react';

const WelcomeLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="login" />
    </Stack>
  )
}

export default WelcomeLayout
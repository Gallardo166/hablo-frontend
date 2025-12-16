import { Stack } from 'expo-router';
import React from 'react';

const RootLayout = () => {
  const session = false;

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(welcome)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  )
}

export default RootLayout

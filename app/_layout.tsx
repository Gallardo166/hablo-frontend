import { UserContext, UserData } from '@/components/welcome/sign-up/UserContext';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';

const RootLayout = () => {
  const [ user, setUser ] = useState<UserData | null>(null);

  const getToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      const response = await fetch("http://localhost:8080/v1/users/" + token, {
        "method": "GET",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      const content = await response.json();
      if (!content.error) {
        setUser(content.user);
      }
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <UserContext value={ {user, setUser} }>
      <Stack>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(welcome)" />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </UserContext>
  )
}

export default RootLayout

import { SessionContext, UserType } from '@/components/context/SessionContext';
import { fetchMessages } from '@/data/state/messagesSlice';
import { store } from '@/data/state/store';
import { createConnection } from '@/data/websocket/Event';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

const RootLayout = () => {
  const [ user, setUser ] = useState<UserType | null>(null);
  const [ conn, setConn ] = useState<WebSocket | null>(null);
  const [ appIsReady, setAppIsReady ] = useState<boolean>(false);

  useEffect(() => {
    const initSession = async () => {
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
        setConn(createConnection(content.otp, content.user.username));
        store.dispatch(fetchMessages());
        setAppIsReady(true);
      }
    }
  }
  initSession();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady])

  return (
      <Provider store={store}>
        <SessionContext value={ {user, conn, setUser, setConn } }>
          <Stack>
            <Stack.Protected guard={!user}>
              <Stack.Screen name="(welcome)" />
            </Stack.Protected>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" options={{ title: "Chats" }} />
            </Stack.Protected>
          </Stack>
        </SessionContext>
      </Provider>
  )
}

export default RootLayout

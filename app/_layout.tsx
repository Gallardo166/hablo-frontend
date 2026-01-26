import { AppContext } from '@/components/context/AppContext';
import { SessionContext, UserType } from '@/components/context/SessionContext';
import { fetchMessages } from '@/data/state/messagesSlice';
import { store } from '@/data/state/store';
import { createConnection } from '@/data/websocket/Event';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [ user, setUser ] = useState<UserType | null>(null);
  const [ conn, setConn ] = useState<WebSocket | null>(null);
  const colorScheme = useColorScheme();

  const [ loaded, error ] = useFonts({
    "Itim": require("../assets/fonts/Itim-Regular.otf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

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
      }
    }
  }
  initSession();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
      <Provider store={store}>
        <AppContext value={ {colorScheme } }>
          <SafeAreaProvider>
            <KeyboardProvider>
              <SessionContext value={ { user, conn, setUser, setConn } }>
                <Stack screenOptions={{headerShown: false}}>
                  <Stack.Protected guard={!user}>
                    <Stack.Screen name="(welcome)" />
                  </Stack.Protected>
                  <Stack.Protected guard={!!user}>
                    <Stack.Screen name="(tabs)" options={{ title: "Chats" }} />
                  </Stack.Protected>
                </Stack>
              </SessionContext>
            </KeyboardProvider>
          </SafeAreaProvider>
        </AppContext>
      </Provider>
  )
}

export default RootLayout

import { useAppContext } from '@/components/context/AppContext';
import { useSessionContext } from '@/components/context/SessionContext';
import { StyledButton, StyledInput, StyledLink, StyledView } from '@/components/Styled';
import { fetchMessages } from '@/data/state/messagesSlice';
import { AppDispatch } from '@/data/state/store';
import { createConnection } from '@/data/websocket/Event';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

type LoginErrorsType = {
  username: string; // cannot be empty, at most 100 chars long
  password: string; // cannot be empty, at least 8 chars long
  general: string; // wrong username or password
}

const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrorsType>({username: "", password: "", general: ""});
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, setConn } = useSessionContext();
  const dispatch = useDispatch<AppDispatch>();
  const { colorScheme } = useAppContext();

  function handleUsernameChangeText(text: string) {
    setUsername(text);
    if (!text) {
      setErrors(errors => ({...errors, username: "Username must not be empty.", general: ""}));
    } else if (text.length > 100) {
      setErrors(errors => ({...errors, username: "Username must be at most 100 characters.", general: ""}));
    } else {
      setErrors(errors => ({...errors, username: "", general: ""}));
    }
  }

  function handlePasswordChangeText(text: string) {
    setPassword(text);
    if (!text) {
      setErrors(errors => ({...errors, password: "Password must not be empty.", general: ""}));
    } else if (password.length < 8) {
      setErrors(errors => ({...errors, password: "Password must be at least 8 characters.", general: ""}));
    } else {
      setErrors(errors => ({...errors, password: "", general: ""}));
    }
  }

  async function handleSubmit(e: GestureResponderEvent) {
    setErrors(errors => ({...errors, general: ""}));
    setLoading(true);
    const response = await fetch("http://localhost:8080/v1/tokens", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username, password
      })
    });
    const content = await response.json();
    if (!content.error) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.setItemAsync("token", content.tokenData.token);
      setUser(content.user);
      setConn(createConnection(content.otp, content.user.username));
      dispatch(fetchMessages());
      setLoading(false);
    } else if (content.error === "the requested resource could not be found" ||
               content.error === "invalid authentication credentials") {
      setErrors(errors => ({...errors, general: "Incorrect username or password."}));
      setLoading(false);
    }
  }

  return (
    <StyledView className="flex gap-8">
      <StyledLink className="text-xl" text="&lt;  Sign up" />
      <View className="flex gap-6">
        <View className="flex gap-3">
          <View>
            <StyledInput placeholder="Username" value={username} onChangeText={handleUsernameChangeText} />
            {errors.username ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.username}</Text> : null}
          </View>
          <View>
            <StyledInput placeholder="Password" value={password} onChangeText={handlePasswordChangeText} />
            {errors.password ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.password}</Text> : null}
          </View>
          {errors.general ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.general}</Text> : null}
        </View>
        <StyledButton
          disabled={!!errors.username || !!errors.password || !username || !password}
          loading={loading}
          text="Log in"
          onPress={handleSubmit}
        />
      </View>
    </StyledView>
  )
}

export default LoginScreen

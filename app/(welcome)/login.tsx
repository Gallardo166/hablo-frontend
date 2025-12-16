import React, { useState } from 'react';
import { Button, GestureResponderEvent, Text, TextInput, View } from 'react-native';

type LoginErrorsType = {
  username: string; // cannot be empty, at most 100 chars long
  password: string; // cannot be empty, at least 8 chars long
}

const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrorsType>({username: "", password: ""});

  function handleUsernameChangeText(text: string) {
    setUsername(text);
    if (!text) {
      setErrors(errors => ({...errors, username: "Username must not be empty."}));
    } else if (text.length > 100) {
      setErrors(errors => ({...errors, username: "Username must be at most 100 characters."}));
    } else {
      setErrors(errors => ({...errors, username: ""}));
    }
  }

  function handlePasswordChangeText(text: string) {
    setPassword(text);
    if (!password) {
      setErrors(errors => ({...errors, password: "Password must not be empty."}));
    } else if (password.length < 8) {
      setErrors(errors => ({...errors, password: "Password must be at least 8 characters."}));
    } else {
      setErrors(errors => ({...errors, password: ""}));
    }
  }

  async function handleSubmit(e: GestureResponderEvent) {
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
    console.log(content);
  }

  return (
    <View>
      <TextInput placeholder="Username" defaultValue={username} onChangeText={handleUsernameChangeText} />
      {errors.username ? <Text>{errors.username}</Text> : null}
      <TextInput placeholder="Password" defaultValue={password} onChangeText={handlePasswordChangeText} />
      {errors.password ? <Text>{errors.password}</Text> : null}
      <Button title="Log in" onPress={handleSubmit} />
    </View>
  )
}

export default LoginScreen

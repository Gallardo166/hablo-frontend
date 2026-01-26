import { useSessionContext } from '@/components/context/SessionContext'
import { SignUpContext } from '@/components/context/SignUpContext'
import { PrimaryText, StyledLink, StyledView } from '@/components/Styled'
import { fetchFriends } from '@/data/state/friendsSlice'
import { AppDispatch } from '@/data/state/store'
import { createConnection } from '@/data/websocket/Event'
import { Slot } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, View } from 'react-native'
import { useDispatch } from 'react-redux'

const SignUpLayout = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, setConn } = useSessionContext();
  const dispatch = useDispatch<AppDispatch>();

  
  const getLanguages = async () => {
    const response = await fetch("http://localhost:8080/v1/languages");
    const json = await response.json();
    console.log(json.languages.names);
    setLanguages(json.languages.names);
  }

  useEffect(() => {
    getLanguages();
  }, []);

  async function handleSubmit(e: GestureResponderEvent) {
    setError("");
    setLoading(true);
    const response = await fetch("http://localhost:8080/v1/users", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username, password, sourceLang, targetLang
      })
    });
    const content = await response.json();
    console.log(content);
    if (!content.error) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.setItemAsync("token", content.tokenData.token);
      setUser(content.user);
      setConn(createConnection(content.otp, content.user.username));
      dispatch(fetchFriends());
      setLoading(false);
    } else if (content.error === "Duplicate value") {
      setError("This username is taken!")
      setLoading(false);
    }
  }

  return (
    <SignUpContext value={{username, password, confirmPassword, imageUrl, sourceLang, targetLang,
      setUsername, setPassword, setConfirmPassword, setImageUrl, setSourceLang, setTargetLang, languages, handleSubmit, error, setError, loading
    }}>
      <StyledView className="flex gap-12">
        <PrimaryText className="mt-4 text-2xl">Let&apos;s get to know you!</PrimaryText>
        <View className="grow">
          <Slot />
        </View>
        <StyledLink text="I already have an account!" className="text-xl self-center mb-4" href="/(welcome)/login" />
      </StyledView>
    </SignUpContext>
  )
}

export default SignUpLayout
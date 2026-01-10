import { useSessionContext } from '@/components/context/SessionContext'
import { SignUpContext } from '@/components/context/SignUpContext'
import { Link, Slot } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, Text, View } from 'react-native'

const SignUpLayout = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const { setUser } = useSessionContext();
  
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
    } else if (content.error === "Duplicate value") {
      setError("This username is taken!")
    }
  }

  return (
    <SignUpContext value={{username, password, confirmPassword, imageUrl, sourceLang, targetLang,
      setUsername, setPassword, setConfirmPassword, setImageUrl, setSourceLang, setTargetLang, languages, handleSubmit, error
    }}>
      <View>
        <Text>Let&apos;s get to know you!</Text>
        <Slot />
        <Text>Placeholder for image</Text>
      </View>
      <Link href="/(welcome)/login">
        I already have an account!
      </Link>
    </SignUpContext>
  )
}

export default SignUpLayout
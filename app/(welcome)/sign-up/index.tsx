import { useSignUpContext } from '@/components/context/SignUpContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SelectDropDown from 'react-native-select-dropdown';

export const Option = (item: string) => {
  return (
    <View>
      <Text>{item}</Text>
    </View>
  )
}

const LanguageDetails = () => {
  const { sourceLang, setSourceLang, targetLang, setTargetLang, languages } = useSignUpContext();
  const [error, setError] = useState<string>("")

  function handleSourceLangSelect(language: string) {
    setSourceLang(language);
    if (language === targetLang) {
      setError("The languages must be different!");
    } else {
      setError("");
    }
  }

  function handleTargetLangSelect(language: string) {
    setTargetLang(language);
    if (language === sourceLang) {
      setError("The languages must be different!");
    } else {
      setError("");
    }
  }

  return (
    <View>
      <Text>What language do you want to learn?</Text>
      <SelectDropDown
        data={languages}
        onSelect={handleSourceLangSelect}
        renderButton={(selectedItem: string) => {
          return (
            <View>
              <Text>{sourceLang || "Choose a language!"}</Text>
            </View>
          )
        }}
        renderItem={Option}
      />
      <Text>What language are you comfortable speaking?</Text>
      <SelectDropDown 
        data={languages}
        onSelect={handleTargetLangSelect}
        renderButton={(selectedItem: string) => {
          return (
            <View>
              <Text>{targetLang || "Choose a language!"}</Text>
            </View>
          )
        }}
        renderItem={Option}
      />
      {error ? <Text>{error}</Text> : null}
      <Link
        href="/(welcome)/sign-up/account-details"
        disabled={!!error || !sourceLang || !targetLang}
      >
        Next
      </Link>
    </View>
  )
}

export default LanguageDetails
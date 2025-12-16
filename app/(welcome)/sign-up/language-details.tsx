import { useSignUpContext } from '@/components/welcome/sign-up/SignUpContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import SelectDropDown from 'react-native-select-dropdown';

export const SelectButton = (selectedItem: string) => {
  return (
    <View>
      <Text>{selectedItem || "Choose a language!"}</Text>
    </View>
  )
}

export const Option = (item: string) => {
  return (
    <View>
      <Text>{item}</Text>
    </View>
  )
}

const LanguageDetails = () => {
  const { sourceLang, setSourceLang, targetLang, setTargetLang, languages, handleSubmit } = useSignUpContext();
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
        renderButton={SelectButton}
        renderItem={Option}
      />
      <Text>What language are you comfortable speaking?</Text>
      <SelectDropDown 
        data={languages}
        onSelect={handleTargetLangSelect}
        renderButton={SelectButton}
        renderItem={Option}
      />
      {error ? <Text>{error}</Text> : null}
      <Link href="/(welcome)/sign-up/account-details">
        Back
      </Link>
      <Button title="Done!" onPress={handleSubmit} />
    </View>
  )
}

export default LanguageDetails
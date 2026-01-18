import { useAppContext } from '@/components/context/AppContext';
import { useSignUpContext } from '@/components/context/SignUpContext';
import { PrimaryText, StyledLink, StyledView } from '@/components/Styled';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SelectDropDown from 'react-native-select-dropdown';

export const Option = (item: string) => {
  return (
    <StyledView>
      <PrimaryText className='bg-zinc-500'>{item}</PrimaryText>
    </StyledView>
  )
}

const LanguageDetails = () => {
  const { sourceLang, setSourceLang, targetLang, setTargetLang } = useSignUpContext();
  const [error, setError] = useState<string>("")
  const languages = ["Chinese", "English", "Thai", "French", "Spanish", "Korean", "Italian", "Russian", "German", "Dutch", "Indonesian", "Japanese"];
  const { colorScheme } = useAppContext();

  function handleSourceLangSelect(language: string) {
    setSourceLang(language);
    if (language === targetLang) {
      setError("The languages must be different.");
    } else {
      setError("");
    }
  }

  function handleTargetLangSelect(language: string) {
    setTargetLang(language);
    if (language === sourceLang) {
      setError("The languages must be different.");
    } else {
      setError("");
    }
  }

  return (
    <View className="flex gap-4">
      <View className="flex gap-2">
        <PrimaryText className="text-lg">What language do you want to learn?</PrimaryText>
        <SelectDropDown dropdownStyle={{borderRadius: 8, backgroundColor: (colorScheme === "light" ? "#e4e4e7" : "#3f3f46"), height: 160}}
          data={languages}
          onSelect={handleSourceLangSelect}
          renderButton={(selectedItem: string) => {
            return (
              <View className={"border rounded-lg flex items-center p-1" +
                              (colorScheme === "light"
                                ? " border-zinc-900 bg-zinc-300"
                                : " border-zinc-500 bg-zinc-800")}>
                <PrimaryText className="text-base">{sourceLang || "Select a language"}</PrimaryText>
              </View>
            )
          }}
          renderItem={(item: string) => {
            return (
              <StyledView className={"p-2 border-b h-[36px] " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-200")}>
                <PrimaryText className="">{item}</PrimaryText>
              </StyledView>
            )}}
          />
      </View>
      <View className="flex gap-2">
        <PrimaryText className="text-lg mt-4">What language are you comfortable speaking?</PrimaryText>
        <SelectDropDown dropdownStyle={{borderRadius: 8, backgroundColor: (colorScheme === "light" ? "#e4e4e7" : "#3f3f46"), height: 160}}
          data={languages}
          onSelect={handleTargetLangSelect}
          renderButton={(selectedItem: string) => {
            return (
              <View className={"border rounded-lg flex items-center p-1 " +
                              (colorScheme === "light"
                                ? "border-zinc-900 bg-zinc-300"
                                : "border-zinc-500 bg-zinc-800")}>
                <PrimaryText className="text-base text-white">{targetLang || "Select a language"}</PrimaryText>
              </View>
            )
          }}
          renderItem={(item: string) => {
            return (
              <StyledView className={"p-2 border-b h-[36px] " + (colorScheme === "light" ? "border-zinc-400" : "border-zinc-200")}>
                <PrimaryText className="">{item}</PrimaryText>
              </StyledView>
            )}}
        />
      </View>
      {error ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{error}</Text> : null}
      <View className="flex-row">
        <View className="grow"></View>
        <StyledLink
          text="Next &gt;"
          href="/(welcome)/sign-up/account-details"
          disabled={!!error || !sourceLang || !targetLang}
        />
      </View>
    </View>
  )
}

export default LanguageDetails
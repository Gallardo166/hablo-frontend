import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, GestureResponderEvent, Keyboard, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "./context/AppContext";

export const PrimaryText = ({children, className}: {children: React.ReactNode, className?: string}) => {
  const { colorScheme } = useAppContext();

  return (
    <Text className={"font-itim " + (colorScheme === "light" ? "text-zinc-700" : "text-zinc-300") + (className ? " " + className : "") }>
      {children}
    </Text>
  )
}

export const SecondaryText = ({children, className}: {children: React.ReactNode, className?: string}) => {
  const { colorScheme } = useAppContext();

  return (
    <Text className={"font-itim " + (colorScheme === "light" ? "text-zinc-500" : "text-zinc-400") + (className ? " " + className : "") }>
      {children}
    </Text>
  )
}

export const StyledLink = ({text, className, href, disabled}: {text: string, className?: string, href?: Href, disabled?: boolean}) => {
  const { colorScheme } = useAppContext();
  const router = useRouter();

  const textColor = colorScheme === "light"
                    ? disabled
                      ? "text-zinc-400"
                      : "text-zinc-700"
                    : disabled
                      ? "text-zinc-600"
                      : "text-zinc-300";

  return (
    <TouchableOpacity disabled={disabled} activeOpacity={disabled ? 1 : 0.4} onPress={() => href ? router.navigate(href) : router.back()}>
      <Text
        className={"font-itim " + textColor + (className ? " " + className : "")}>
          {text}
      </Text>
    </TouchableOpacity>
  )
}

export const StyledView = ({children, className}: {children: React.ReactNode, className? : string}) => {
  const [ safeBottom, setSafeBottom ] = useState<boolean>(true);
  const { colorScheme } = useAppContext();

  useEffect(() => {
    const keyboardOpenEvent = Keyboard.addListener("keyboardWillShow", () => setSafeBottom(false));
    const keyboardCloseEvent = Keyboard.addListener("keyboardWillHide", () => setSafeBottom(true));

    return () => {
      keyboardOpenEvent.remove();
      keyboardCloseEvent.remove();
    }
  }, []);

  return (
    <SafeAreaView
      edges={safeBottom ? ["right", "top", "left", "bottom"] : ["right", "top", "left"]}
      className={"h-screen pl-12 pr-12 " + (colorScheme === "light" ? "bg-zinc-200" : "bg-zinc-900") + (className ? " " + className : "")}
    >
      {children}
    </SafeAreaView>
  )
}

export const StyledInput = ({placeholder, value, onChangeText, className, multiline}: {placeholder: string, value: string, onChangeText: (text: string) => void, className?: string, multiline?: boolean} ) => {
  const { colorScheme } = useAppContext();

  const scheme = colorScheme === "light"
                  ? "text-zinc-800 border-zinc-800 bg-zinc-300"
                  : "text-zinc-300 border-zinc-500"

  return (
    <TextInput
      multiline={!!multiline}
      className={"border rounded-lg font-itim p-2 " + scheme + " " + className}
      placeholderTextColor="#71717b"
      placeholder={placeholder} value={value} onChangeText={onChangeText} />
  )
}

export const StyledButton = ({loading, disabled, text, onPress}: {loading: boolean, disabled: boolean, text: string, onPress: (e: GestureResponderEvent) => void}) => {
  const { colorScheme } = useAppContext();

  const backgroundColor = colorScheme === "light"
                          ? disabled
                            ? "bg-violet-300"
                            : "bg-violet-700"
                          : disabled
                            ? "bg-zinc-700"
                            : "bg-violet-800";

  const textColor = disabled
                    ? colorScheme === "light"
                      ? "text-zinc-400"
                      : "text-zinc-400"
                    : "text-zinc-300";
                  
  return (
    <TouchableOpacity
      className={"mt-4 self-center pt-1 pb-1 pl-4 pr-4 rounded-lg " + backgroundColor}
      activeOpacity={0.6}
      disabled={disabled}
      onPress={onPress}>
      {loading
        ? <ActivityIndicator />
        : <Text className={"font-itim text-xl " + textColor}>{text}</Text>}
    </TouchableOpacity>
  )
}
import React, { createContext, useContext } from 'react';
import { GestureResponderEvent } from 'react-native';

export type SignUpContextType = {
  username: string;
  password: string;
  confirmPassword: string;
  imageUrl: string;
  sourceLang: string;
  targetLang: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setSourceLang: React.Dispatch<React.SetStateAction<string>>;
  setTargetLang: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
  handleSubmit: (e: GestureResponderEvent) => Promise<void>;
  error: string;
  loading: boolean;
}

export const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error("context not found");
  } else {
    return context;
  }
}



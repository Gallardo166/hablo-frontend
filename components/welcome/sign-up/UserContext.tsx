import { createContext, useContext } from "react";

export type UserData = {
  username: string;
  imageUrl: string;
  sourceLang: string;
  targetLang: string;
  lastActiveDate: string;
}
export type UserContextType = {
  user: UserData | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("context not found");
  } else {
    return context;
  }
}
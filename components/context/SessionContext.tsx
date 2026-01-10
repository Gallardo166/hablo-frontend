import { createContext, useContext } from "react";

export type UserType = {
  username: string;
  imageUrl: string;
  sourceLang: string;
  targetLang: string;
  lastActiveDate: string;
}
export type SessionContextType = {
  user: UserType | null;
  conn: WebSocket | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setConn: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("context not found");
  } else {
    return context;
  }
}
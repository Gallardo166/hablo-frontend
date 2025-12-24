import { createContext, useContext } from "react";

export type FriendType = {
  username: string;
  imageUrl: string;
  status: string;
}

export type SocialContextType = {
  loading: boolean;
  friends: FriendType[];
  handleSendRequest: (recipient: string) => void;
  handleRemove: (username: string) => void;
  handleAcceptRequest: (sender: string) => void;
}

export const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocialContext = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error("context not found");
  } else {
    return context;
  }
}


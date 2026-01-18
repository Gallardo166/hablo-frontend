import { createContext, useContext } from "react"
import { ColorSchemeName } from "react-native"

export type AppContextType = {
  colorScheme: ColorSchemeName
}

export const AppContext = createContext<AppContextType>({ colorScheme: "light" });

export const useAppContext = () => {
  return useContext(AppContext);
}
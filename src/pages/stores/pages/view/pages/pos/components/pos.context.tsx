import { createContext, useContext, type PropsWithChildren } from "react";

export const PosContext = createContext({});

export const PosContextProvider = ({ children }: PropsWithChildren) => {
  return <PosContext.Provider value={{}}>{children}</PosContext.Provider>;
};

export const usePos = () => {
  return useContext(PosContext);
};

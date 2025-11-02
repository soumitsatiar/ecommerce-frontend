import { createContext, useContext, useState, type ReactNode } from "react";

type GlobalState = {
  user: { email: string; role: string } | null;
  setUser: (user: { email: string; role: string } | null) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const useGlobal = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

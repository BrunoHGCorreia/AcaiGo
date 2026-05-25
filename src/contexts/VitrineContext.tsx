"use client";
import { createContext, useContext, useState, useCallback } from "react";

type VitrineContextType = {
  isVitrine: boolean;
  toggleVitrine: () => void;
  enterVitrine: () => void;
  exitVitrine: () => void;
};

const VitrineContext = createContext<VitrineContextType>({
  isVitrine: false,
  toggleVitrine: () => {},
  enterVitrine: () => {},
  exitVitrine: () => {},
});

export function VitrineProvider({ children }: { children: React.ReactNode }) {
  const [isVitrine, setIsVitrine] = useState(false);

  const toggleVitrine = useCallback(() => setIsVitrine(v => !v), []);
  const enterVitrine = useCallback(() => setIsVitrine(true), []);
  const exitVitrine = useCallback(() => setIsVitrine(false), []);

  return (
    <VitrineContext.Provider value={{ isVitrine, toggleVitrine, enterVitrine, exitVitrine }}>
      {children}
    </VitrineContext.Provider>
  );
}

export const useVitrine = () => useContext(VitrineContext);

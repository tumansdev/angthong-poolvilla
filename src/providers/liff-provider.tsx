"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeLiff, getProfile, isLoggedIn, isInLiff, login } from "@/lib/liff";
import { LineProfile } from "@/types";

interface LiffContextType {
  isReady: boolean;
  isInLiff: boolean;
  isLoggedIn: boolean;
  profile: LineProfile | null;
  error: string | null;
  login: () => Promise<void>;
}

const LiffContext = createContext<LiffContextType>({
  isReady: false,
  isInLiff: false,
  isLoggedIn: false,
  profile: null,
  error: null,
  login: async () => {},
});

interface LiffProviderProps {
  children: ReactNode;
}

export function LiffProvider({ children }: LiffProviderProps) {
  const [state, setState] = useState<{
    isReady: boolean;
    isInLiff: boolean;
    isLoggedIn: boolean;
    profile: LineProfile | null;
    error: string | null;
  }>({
    isReady: false,
    isInLiff: false,
    isLoggedIn: false,
    profile: null,
    error: null,
  });

  useEffect(() => {
    async function init() {
      const success = await initializeLiff();

      if (!success) {
        setState((prev) => ({
          ...prev,
          isReady: true,
          error: "LIFF initialization failed. Running in demo mode.",
        }));
        return;
      }

      const inLiff = isInLiff();
      const loggedIn = isLoggedIn();
      let profile: LineProfile | null = null;

      if (loggedIn) {
        profile = await getProfile();
      }

      setState({
        isReady: true,
        isInLiff: inLiff,
        isLoggedIn: loggedIn,
        profile,
        error: null,
      });
    }

    init();
  }, []);

  const handleLogin = async () => {
    await login();
  };

  return (
    <LiffContext.Provider value={{ ...state, login: handleLogin }}>
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);

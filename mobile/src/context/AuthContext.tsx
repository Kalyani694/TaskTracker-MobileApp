import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../types";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isRestoring: boolean;
  setSession: (token: string, user: AuthUser) => Promise<void>;
  clearSession: () => Promise<void>;
};

const AUTH_TOKEN_KEY = "tasktracker_token";
const AUTH_USER_KEY = "tasktracker_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  const setSession = async (newToken: string, newUser: AuthUser) => {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, newToken],
      [AUTH_USER_KEY, JSON.stringify(newUser)]
    ]);
    setToken(newToken);
    setUser(newUser);
  };

  const clearSession = async () => {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isRestoring, setSession, clearSession }),
    [token, user, isRestoring]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

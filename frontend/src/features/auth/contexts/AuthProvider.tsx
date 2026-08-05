import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SESSION_EXPIRED_EVENT } from "../../../services/api";
import {
  getCurrentUser,
  login,
} from "../services/auth.service";
import type {
  LoginRequest,
  User,
} from "../types/auth.types";
import {
  AuthContext,
  type AuthContextData,
} from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_STORAGE_KEY = "@clone-trello:token";
const USER_STORAGE_KEY = "@clone-trello:user";

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        setUser(response.user);

        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(response.user),
        );
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      sessionStorage.setItem(
        "@clone-trello:session-expired",
        "true",
      );

      setUser(null);
    }

    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      handleSessionExpired,
    );

    return () => {
      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, []);

  async function signIn(
    credentials: LoginRequest,
  ): Promise<void> {
    const response = await login(credentials);

    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      response.token,
    );

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(response.user),
    );

    sessionStorage.removeItem(
      "@clone-trello:session-expired",
    );

    setUser(response.user);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    sessionStorage.removeItem(
      "@clone-trello:session-expired",
    );

    setUser(null);
  }

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
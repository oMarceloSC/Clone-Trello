import { createContext } from "react";

import type {
  LoginRequest,
  User,
} from "../types/auth.types";

export type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData | null>(
  null,
);
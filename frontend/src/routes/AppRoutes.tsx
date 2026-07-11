import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";

type RequireAuthenticationProps = {
  children: ReactNode;
};

function RequireAuthentication({
  children,
}: RequireAuthenticationProps) {
  const token = localStorage.getItem(
    "@clone-trello:token",
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuthentication>
            <DashboardPage />
          </RequireAuthentication>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}
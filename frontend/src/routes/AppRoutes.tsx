import { Navigate, Route, Routes } from "react-router";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

function RequireAuthentication({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("@clone-trello:token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RegisterPlaceholder() {
  return (
    <main className="placeholder-page">
      <h1>Cadastro</h1>
      <p>A página de cadastro será implementada em seguida.</p>
    </main>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/register"
        element={<RegisterPlaceholder />}
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
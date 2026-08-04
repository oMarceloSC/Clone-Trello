import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AcceptWorkspaceInvitationPage } from "../features/workspaces/pages/AcceptWorkspaceInvitationPage";
import { WorkspacePage } from "../features/workspaces/pages/WorkspacePage";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { DashboardPage } from "../pages/DashboardPage";

type RouteGuardProps = {
  children: ReactNode;
};

function LoadingPage() {
  return (
    <main className="loading-page">
      <p>Carregando sessão...</p>
    </main>
  );
}

function RequireAuthentication({
  children,
}: RouteGuardProps) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireGuest({
  children,
}: RouteGuardProps) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/login"
        element={
          <RequireGuest>
            <LoginPage />
          </RequireGuest>
        }
      />

      <Route
        path="/register"
        element={
          <RequireGuest>
            <RegisterPage />
          </RequireGuest>
        }
      />

      <Route
        element={
          <RequireAuthentication>
            <AuthenticatedLayout />
          </RequireAuthentication>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/workspaces/:id"
          element={<WorkspacePage />}
        />

        <Route
          path="/workspace-invitations/:token/accept"
          element={<AcceptWorkspaceInvitationPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}
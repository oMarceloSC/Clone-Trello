import { NavLink, Outlet, useNavigate } from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  function handleLogout() {
    signOut();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="authenticated-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">T</span>

          <div>
            <strong>Clone do Trello</strong>
            <small>Organize seus projetos</small>
          </div>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label="Navegação principal"
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link sidebar-link-active"
                : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>

          <button
            type="button"
            className="sidebar-link sidebar-link-disabled"
            disabled
            title="Disponível nas próximas etapas"
          >
            Boards
          </button>

          <button
            type="button"
            className="sidebar-link sidebar-link-disabled"
            disabled
            title="Disponível nas próximas etapas"
          >
            Notificações
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name.charAt(0).toUpperCase() ?? "U"}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.name ?? "Usuário"}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="authenticated-content">
        <header className="app-header">
          <div>
            <span className="app-header-label">
              Área autenticada
            </span>

            <strong>
              Bem-vindo{user ? `, ${user.name}` : ""}
            </strong>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </header>

        <div className="authenticated-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
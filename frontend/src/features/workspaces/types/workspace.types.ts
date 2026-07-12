export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "MEMBER"
  | "VIEWER";

export type WorkspaceMemberUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type WorkspaceMember = {
  id: string;
  userId?: string;
  workspaceId?: string;
  role: WorkspaceRole;
  createdAt: string;
  user?: WorkspaceMemberUser;
};

export type Workspace = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
};

export type ListWorkspacesResponse = {
  workspaces: Workspace[];
};

export type CreateWorkspaceRequest = {
  name: string;
  description?: string;
};

export type CreateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
};
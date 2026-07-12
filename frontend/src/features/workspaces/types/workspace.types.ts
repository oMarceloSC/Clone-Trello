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
  role: WorkspaceRole;
  createdAt: string;
  user: WorkspaceMemberUser;
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
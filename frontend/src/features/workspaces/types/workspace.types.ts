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

export type GetWorkspaceResponse = {
  workspace: Workspace;
};

export type CreateWorkspaceRequest = {
  name: string;
  description?: string;
};

export type CreateWorkspaceResponse = {
  message: string;
  workspace: Workspace;
};

export type UpdateWorkspaceRequest = {
  name: string;
  description?: string;
};

export type UpdatedWorkspace = Omit<Workspace, "members"> & {
  members?: WorkspaceMember[];
};

export type UpdateWorkspaceResponse = {
  message: string;
  workspace: UpdatedWorkspace;
};

export type DeleteWorkspaceResponse = {
  message: string;
};

export type ListWorkspaceMembersResponse = {
  members: WorkspaceMember[];
};

export type UpdateWorkspaceMemberRoleRequest = {
  role: Exclude<WorkspaceRole, "OWNER">;
};

export type UpdateWorkspaceMemberRoleResponse = {
  message: string;
  member: WorkspaceMember;
};

export type WorkspaceInvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED";

export type WorkspaceInvitation = {
  id: string;
  email: string;
  token: string;
  status: WorkspaceInvitationStatus;
  workspaceId: string;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkspaceInvitationRequest = {
  email: string;
};

export type CreateWorkspaceInvitationResponse = {
  message: string;
  invitation: WorkspaceInvitation;
};

export type PendingWorkspaceInvitationWorkspace = {
  id: string;
  name: string;
  description: string | null;
};

export type PendingWorkspaceInvitationInvitedBy = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type PendingWorkspaceInvitation = {
  id: string;
  email: string;
  token: string;
  status: WorkspaceInvitationStatus;
  workspaceId: string;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  workspace: PendingWorkspaceInvitationWorkspace;
  invitedBy: PendingWorkspaceInvitationInvitedBy;
};

export type ListPendingWorkspaceInvitationsResponse = {
  invitations: PendingWorkspaceInvitation[];
};

export type AcceptWorkspaceInvitationResponse = {
  message: string;
  workspaceMember: WorkspaceMember;
  invitation: WorkspaceInvitation;
};
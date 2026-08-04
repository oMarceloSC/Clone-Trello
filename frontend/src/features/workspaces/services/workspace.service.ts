import { api } from "../../../services/api";

import type {
  AcceptWorkspaceInvitationResponse,
  CreateWorkspaceInvitationRequest,
  CreateWorkspaceInvitationResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DeleteWorkspaceResponse,
  GetWorkspaceResponse,
  ListPendingWorkspaceInvitationsResponse,
  ListWorkspaceMembersResponse,
  ListWorkspacesResponse,
  PendingWorkspaceInvitation,
  UpdateWorkspaceMemberRoleRequest,
  UpdateWorkspaceMemberRoleResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  Workspace,
  WorkspaceMember,
} from "../types/workspace.types";

export async function listWorkspaces(): Promise<Workspace[]> {
  const response =
    await api.get<ListWorkspacesResponse>("/workspaces");

  return response.data.workspaces;
}

export async function getWorkspaceById(
  workspaceId: string,
): Promise<Workspace> {
  const response = await api.get<GetWorkspaceResponse>(
    `/workspaces/${workspaceId}`,
  );

  return response.data.workspace;
}

export async function createWorkspace(
  data: CreateWorkspaceRequest,
): Promise<CreateWorkspaceResponse> {
  const response = await api.post<CreateWorkspaceResponse>(
    "/workspaces",
    data,
  );

  return response.data;
}

export async function updateWorkspace(
  workspaceId: string,
  data: UpdateWorkspaceRequest,
): Promise<UpdateWorkspaceResponse> {
  const response = await api.patch<UpdateWorkspaceResponse>(
    `/workspaces/${workspaceId}`,
    data,
  );

  return response.data;
}

export async function deleteWorkspace(
  workspaceId: string,
): Promise<DeleteWorkspaceResponse> {
  const response = await api.delete<DeleteWorkspaceResponse>(
    `/workspaces/${workspaceId}`,
  );

  return response.data;
}

export async function listWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const response =
    await api.get<ListWorkspaceMembersResponse>(
      `/workspaces/${workspaceId}/members`,
    );

  return response.data.members;
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  memberId: string,
  data: UpdateWorkspaceMemberRoleRequest,
): Promise<UpdateWorkspaceMemberRoleResponse> {
  const response =
    await api.patch<UpdateWorkspaceMemberRoleResponse>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      data,
    );

  return response.data;
}

export async function createWorkspaceInvitation(
  workspaceId: string,
  data: CreateWorkspaceInvitationRequest,
): Promise<CreateWorkspaceInvitationResponse> {
  const response =
    await api.post<CreateWorkspaceInvitationResponse>(
      `/workspaces/${workspaceId}/invitations`,
      data,
    );

  return response.data;
}

export async function listPendingWorkspaceInvitations(): Promise<
  PendingWorkspaceInvitation[]
> {
  const response =
    await api.get<ListPendingWorkspaceInvitationsResponse>(
      "/workspace-invitations/pending",
    );

  return response.data.invitations;
}

export async function acceptWorkspaceInvitation(
  invitationToken: string,
): Promise<AcceptWorkspaceInvitationResponse> {
  const response =
    await api.post<AcceptWorkspaceInvitationResponse>(
      `/workspace-invitations/${invitationToken}/accept`,
      {},
    );

  return response.data;
}
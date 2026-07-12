import { api } from "../../../services/api";

import type {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  ListWorkspacesResponse,
  Workspace,
} from "../types/workspace.types";

export async function listWorkspaces(): Promise<Workspace[]> {
  const response =
    await api.get<ListWorkspacesResponse>("/workspaces");

  return response.data.workspaces;
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
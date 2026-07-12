import { api } from "../../../services/api";

import type {
  ListWorkspacesResponse,
  Workspace,
} from "../types/workspace.types";

export async function listWorkspaces(): Promise<Workspace[]> {
  const response =
    await api.get<ListWorkspacesResponse>("/workspaces");

  return response.data.workspaces;
}
import { api } from "../../../services/api";

import type {
  CurrentUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types";

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    data,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response =
    await api.get<CurrentUserResponse>("/auth/me");

  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    data,
  );

  return response.data;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>(
    "/auth/reset-password",
    data,
  );

  return response.data;
}
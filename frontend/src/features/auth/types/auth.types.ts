export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export type CurrentUserResponse = {
  user: User;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
  resetToken: string | null;
  resetUrl: string | null;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};
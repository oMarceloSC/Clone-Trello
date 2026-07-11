export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
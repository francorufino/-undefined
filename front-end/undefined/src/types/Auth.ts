export interface AuthUser{
id: string;
email: string;
token: string;
}

export interface AuthResponse{
  message: string;
  user: AuthUser;
  accessToken: string;
}
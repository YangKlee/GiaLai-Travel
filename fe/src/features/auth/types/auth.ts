export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegistrationInput extends LoginInput {
  displayName: string;
}
export interface ForgotPasswordInput {
  email: string;
}
export interface ForgotPasswordResponse {
  data: { accepted: true; message: string };
}
export interface ResetPasswordInput {
  token: string;
  password: string;
}
export interface ResetPasswordResponse {
  data: { message: string };
}
export interface SessionResponse {
  data: { accessToken: string; tokenType: 'Bearer'; expiresIn: number; user: AuthUser };
}

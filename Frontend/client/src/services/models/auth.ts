export interface AuthRequest {
  email: string;
  password: string;
  companyId: number;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message?: string;
}

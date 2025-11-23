import { api } from "./api";
import type { AuthRequest, LoginResponse, RegisterResponse } from "./models/auth";

export const authApi = {
  /**
   * Realiza login/autenticação
   */
  login: (data: AuthRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/Auth/login", data);
  },

  /**
   * Registra um novo usuário
   */
  register: (data: AuthRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/Auth/register", data);
  },
};

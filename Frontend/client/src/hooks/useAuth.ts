import { useState, useCallback, useEffect } from "react";
import { api, LoginResponse } from "@/services/api";

interface AuthState {
  isAuthenticated: boolean;
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  // Verificar se há token salvo ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    if (token && user) {
      setState({
        isAuthenticated: true,
        user: JSON.parse(user),
        loading: false,
        error: null,
      });
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string, companyId: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await api.post<LoginResponse>("/auth/login", {
          email,
          password,
          companyId,
        });

        api.setToken(response.token);
        localStorage.setItem("authUser", JSON.stringify(response));

        setState({
          isAuthenticated: true,
          user: response,
          loading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao fazer login";
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, companyId: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await api.post("/auth/register", {
          email,
          password,
          companyId,
        });

        setState((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao registrar";
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    []
  );

  const logout = useCallback(() => {
    api.clearToken();
    localStorage.removeItem("authUser");
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
  };
};

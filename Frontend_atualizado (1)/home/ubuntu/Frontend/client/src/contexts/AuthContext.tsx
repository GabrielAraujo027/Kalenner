import { createContext, ReactNode, useEffect, useState } from "react";
import { api, AuthRequest } from "@/services/api";

interface User {
  email: string;
  roles: string[];
  companyId: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, companyId: number) => Promise<void>;
  register: (email: string, password: string, companyId: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kalenner_token");
    const email = localStorage.getItem("kalenner_email");
    const roles = localStorage.getItem("kalenner_roles");
    const companyIdRaw = localStorage.getItem("kalenner_company_id");

    if (token && email && roles && companyIdRaw) {
      setUser({
        email,
        roles: JSON.parse(roles),
        companyId: Number(companyIdRaw),
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, companyId: number) => {
    const payload: AuthRequest = { email, password, companyId };
    const { token } = await api.login(payload);

    const loggedUser: User = {
      email,
      roles: [],
      companyId,
    };

    localStorage.setItem("kalenner_token", token);
    localStorage.setItem("kalenner_email", email);
    localStorage.setItem("kalenner_roles", JSON.stringify(loggedUser.roles));
    localStorage.setItem("kalenner_company_id", String(companyId));
    setUser(loggedUser);
  };

  const register = async (email: string, password: string, companyId: number) => {
    const payload: AuthRequest = { email, password, companyId };
    await api.register(payload);
  };

  const logout = () => {
    localStorage.removeItem("kalenner_token");
    localStorage.removeItem("kalenner_email");
    localStorage.removeItem("kalenner_roles");
    localStorage.removeItem("kalenner_company_id");
    localStorage.removeItem("kalenner_token_expires");
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

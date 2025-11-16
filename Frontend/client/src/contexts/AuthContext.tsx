import { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  email: string;
  roles: string[];
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, companyId: string) => Promise<void>;
  signup: (email: string, password: string, companyId: string, role: string) => Promise<void>;
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
    // Verificar se há um usuário logado no localStorage
    const token = localStorage.getItem("kalenner_token");
    const email = localStorage.getItem("kalenner_email");
    const roles = localStorage.getItem("kalenner_roles");
    const companyId = localStorage.getItem("kalenner_company_id");

    if (token && email && roles && companyId) {
      setUser({
        email,
        roles: JSON.parse(roles),
        companyId,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, companyId: string) => {
    // Simulação de login - em produção, fazer chamada à API
    // Por enquanto, vamos simular um login bem-sucedido
    const mockUser: User = {
      email,
      roles: ["Empresa"], // ou ["Cliente"] dependendo do tipo de usuário
      companyId,
    };

    // Salvar no localStorage
    localStorage.setItem("kalenner_token", "mock-token-" + Date.now());
    localStorage.setItem("kalenner_email", email);
    localStorage.setItem("kalenner_roles", JSON.stringify(mockUser.roles));
    localStorage.setItem("kalenner_company_id", companyId);
    localStorage.setItem("kalenner_token_expires", String(Date.now() + 24 * 60 * 60 * 1000));

    setUser(mockUser);
  };

  const signup = async (email: string, password: string, companyId: string, role: string) => {
    // Simulação de cadastro - em produção, fazer chamada à API
    const mockUser: User = {
      email,
      roles: [role],
      companyId,
    };

    // Salvar no localStorage
    localStorage.setItem("kalenner_token", "mock-token-" + Date.now());
    localStorage.setItem("kalenner_email", email);
    localStorage.setItem("kalenner_roles", JSON.stringify(mockUser.roles));
    localStorage.setItem("kalenner_company_id", companyId);
    localStorage.setItem("kalenner_token_expires", String(Date.now() + 24 * 60 * 60 * 1000));

    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("kalenner_token");
    localStorage.removeItem("kalenner_email");
    localStorage.removeItem("kalenner_roles");
    localStorage.removeItem("kalenner_company_id");
    localStorage.removeItem("kalenner_token_expires");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
